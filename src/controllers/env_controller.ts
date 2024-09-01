import type { $slash } from "peach";
import type { deleteEnv, getEnv, setEnv } from "../commands";
import { readText, splitOnce } from "../util";

export class EnvController {
  private project?: string;

  async set(interaction: $slash<typeof setEnv>) {
    const { project, name, value } = interaction.options();
    this.project = project;
    const env = await this.getValues();
    env[name] = value;
    await this.saveValues(env);
    await interaction.respondWith(this.response(env));
  }

  async delete(interaction: $slash<typeof deleteEnv>) {
    const { project, name } = interaction.options();
    this.project = project;
    const env = await this.getValues();
    delete env[name];
    await this.saveValues(env);
    await interaction.respondWith(this.response(env));
  }

  async get(interaction: $slash<typeof getEnv>) {
    const { project } = interaction.options();
    this.project = project;
    const env = await this.getValues();
    console.log("env", env);
    await interaction.respondWith(this.response(env));
  }

  private response(env: Record<string, string>) {
    const text = Object.entries(env)
      .map(([k, v]) => `${k}="${v}"`)
      .join("\n");
    console.log(text);
    return {
      content: `\`\`\`sh\n${text}\n\`\`\``,
      flags: 1 << 6,
    };
  }

  private async getValues() {
    const text = await readText(this.envPath());
    if (!text) return {};
    return Object.fromEntries(
      text
        .split("\n")
        .filter((line) => line.includes("="))
        .map((line) =>
          splitOnce(line, "=").map((v) => v.replaceAll(/'|"|`/g, "").trim())
        )
    );
  }

  private async saveValues(env: Record<string, string>) {
    const text = Object.entries(env)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    return await Bun.write(this.envPath(), text);
  }

  private envPath() {
    if (!this.project) throw new Error("Missing project");
    return `../${this.project}/.env`;
  }
}
