import type { PushEvent } from "@octokit/webhooks-types";
import { $ } from "bun";

interface Config {
  deploy: string;
}

export async function handlePushEvent(event: PushEvent) {
  if (event.ref !== "refs/heads/main") return;
  const repo = event.repository.name;
  const dir = `${Bun.env.HOME}/${repo}`;
  await $`git pull`.cwd(dir);
  const config = await getConfig(dir);
  if (config) {
    await $`${{ raw: config.deploy }}`.cwd(dir);
  }
  await fetch(`${Bun.env.DISCORD_WEBHOOK!}?wait=true`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      content: `Deployed ${event.head_commit?.id} for ${repo}`,
    }),
  });
}

async function getConfig(dir: string) {
  try {
    return (await import(`${dir}/orange.toml`)) as Config;
  } catch {
    return undefined;
  }
}
