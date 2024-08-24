import type { PushEvent } from "@octokit/webhooks-types";
import { $ } from "bun";
import { executeWebhook } from "./discord/execute_webhook";
import { editWebhook } from "./discord/edit_webhook";

interface Config {
  deploy: string;
}

export async function handlePushEvent(event: PushEvent) {
  if (event.ref !== "refs/heads/main") return;
  const repo = event.repository.name;
  const dir = `${Bun.env.HOME}/${repo}`;

  const webhookResponse = await executeWebhook(
    {
      embeds: [createEmbed(event, false)],
    },
    { wait: true }
  );

  await $`git pull`.cwd(dir);
  const config = await getConfig(dir);
  if (config) {
    await $`${{ raw: config.deploy }}`.cwd(dir);
  }

  await editWebhook(webhookResponse.id, { embeds: [createEmbed(event, true)] });
}

async function getConfig(dir: string) {
  try {
    return (await import(`${dir}/orange.toml`)) as Config;
  } catch {
    return undefined;
  }
}

function createEmbed(event: PushEvent, success: boolean) {
  const footer = event.head_commit
    ? {
        text: event.head_commit?.id,
      }
    : undefined;
  return {
    author: {
      name: event.sender.login,
      icon_url: event.sender.avatar_url,
      url: event.sender.html_url,
    },
    title: success
      ? `Deployed ${event.repository.name}`
      : `Depoloying ${event.repository.name}`,
    description: event.commits.map((c) => `- ${c.message}`).join("\n"),
    footer,
    color: success ? 0x4bae4f : 0xffe547,
    timestamp: event.head_commit?.timestamp,
    url: event.compare,
  };
}
