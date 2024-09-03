import Database from "bun:sqlite";
import type { Embed } from "./discord/types";

const DATABASE_PATH = "key_value.sqlite";

class KeyValue<T> {
  key!: string | number;
  value!: string;
  created_at!: number;
  updated_at!: number;
  exp_at?: number;

  private _parsedValue!: T;

  get parsedValue() {
    this._parsedValue ??= JSON.parse(this.value);
    return this._parsedValue;
  }
}

export class KeyValueStore<T extends Record<string | number, any>> {
  private db: Database;

  constructor() {
    this.db = new Database(DATABASE_PATH, { strict: true, create: true });
    this.db.exec("PRAGMA journal_mode = WAL;");
    const hasTable = !!this.db
      .query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='key_value'"
      )
      .get();
    if (!hasTable) {
      this.db
        .query(
          `CREATE TABLE key_value(
            key NUMERIC PRIMARY KEY,
            value BLOB NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL,
            exp_at INTEGER
          );`
        )
        .run();
    }
  }

  set<K extends keyof T>(key: K, value: T[K], expirationDate?: Date | number) {
    if (typeof key === "symbol") throw new Error("Key cannot be symbol");
    this.db
      .query(
        `
        INSERT INTO key_value (key,value,created_at,updated_at,exp_at)
          VALUES($key,$value,$created_at,$updated_at,$exp_at)
          ON CONFLICT(key) DO UPDATE SET
            value=excluded.value,
            updated_at=excluded.updated_at,
            exp_at=excluded.exp_at;`
      )
      .run({
        key,
        value: JSON.stringify(value),
        created_at: Date.now(),
        updated_at: Date.now(),
        exp_at: this.expAt(expirationDate),
      });
  }

  get<K extends keyof T>(key: K) {
    if (typeof key === "symbol") throw new Error("Key cannot be symbol");
    const keyValue = this.db
      .query(`SELECT * FROM key_value WHERE key = $key;`)
      .as(KeyValue<T[K]>)
      .get({ key });
    if (keyValue?.exp_at && keyValue.exp_at <= Date.now()) {
      this.db.query("DELETE FROM key_value WHERE key = $key").run({ key });
      return null;
    } else {
      return keyValue;
    }
  }

  delete<K extends keyof T>(key: K) {
    if (typeof key === "symbol") throw new Error("Key cannot be symbol");
    this.db.query("DELETE FROM key_value WHERE key = $key").run({ key });
  }

  private expAt(date?: Date | number) {
    if (!date) return null;
    if (typeof date === "number") return date;
    return date.valueOf();
  }
}

export interface KVSchema {
  sendOnStart: {
    webhookId: string;
    payload: { embeds: Embed[] };
  };
}

export const KV = new KeyValueStore<KVSchema>();
