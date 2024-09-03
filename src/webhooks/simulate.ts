import type { PushEvent } from "@octokit/webhooks-types";
import { handlePushEvent } from "./event_handlers";
import { parseArgs } from "util";
import { KV } from "../kv";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {},
  strict: true,
  allowPositionals: true,
});

const [, , repo] = positionals;

console.log(`Simulating push event for ${repo}`);

await handlePushEvent({
  ref: "refs/heads/main",
  repository: {
    name: repo,
  },
  sender: {
    login: "arjunchib",
  },
  commits: [{ message: "Test CI" }],
} as PushEvent);
