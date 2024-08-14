import type { PushEvent } from "@octokit/webhooks-types";
import { $ } from "bun";

export async function handlePushEvent(event: PushEvent) {
  if (event.ref !== "refs/heads/main") return;
  const repo = event.repository.name;
  if (repo === "peach") {
    await $`git pull`.cwd(`${Bun.env.HOME}/peach`);
  } else if (repo === "memebot3") {
    await $`git pull && sudo systemctl restart memebot`.cwd(
      `${Bun.env.HOME}/memebot3`
    );
  }
}
