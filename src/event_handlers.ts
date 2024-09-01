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
    Bun.env.DEPLOY_WEBHOOK!,
    {
      embeds: [createEmbed(event, false)],
    },
    { wait: true }
  );

  await $`git pull`.cwd(dir);
  const config = await getConfig(dir);
  const embeds = [createEmbed(event, true)];

  if (repo === "orange") {
    Bun.write(
      ".tmp_state",
      JSON.stringify(
        {
          sendOnStart: {
            webhookId: webhookResponse.id,
            payload: { embeds },
          },
        },
        null,
        2
      )
    );
  }

  if (config) {
    await $`${{ raw: config.deploy }}`.cwd(dir);
  }

  await editWebhook(webhookResponse.id, { embeds });
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
      : `Deploying ${event.repository.name}`,
    description: event.commits.map((c) => `- ${c.message}`).join("\n"),
    footer,
    color: success ? 0x4bae4f : 0xffe547,
    timestamp: event.head_commit?.timestamp,
    url: event.compare,
  };
}
