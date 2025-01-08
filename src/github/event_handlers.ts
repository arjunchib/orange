import type { PushEvent } from "@octokit/webhooks-types";
import { $ } from "bun";
import { executeWebhook } from "../discord/execute_webhook";
import { editWebhook } from "../discord/edit_webhook";
import { unlink } from "fs/promises";

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
      embeds: [createEmbed(event, "pending")],
    },
    { wait: true }
  );

  await $`git pull`.cwd(dir);
  const config = await getConfig(dir);
  const embeds = [createEmbed(event, "success")];

  if (repo === "orange") {
    KV.set("sendOnStart", {
      webhookId: webhookResponse.id,
      payload: { embeds },
    });
  }

  if (config) {
    console.log(`Deploying ${repo}: ${config.deploy}`);
    try {
      await $`${{ raw: config.deploy }}`.cwd(dir);
      await editWebhook(webhookResponse.id, { embeds });
    } catch (e) {
      console.error(e);
      await editWebhook(webhookResponse.id, {
        embeds: [createEmbed(event, "failure")],
      });
      try {
        await unlink(".tmp_state");
      } catch {}
    }
  }
}

async function getConfig(dir: string) {
  try {
    const file = Bun.file(`${dir}/orange.toml`);
    return Bun.TOML.parse(await file.text()) as Config;
  } catch {
    return undefined;
  }
}

function createEmbed(
  event: PushEvent,
  state: "pending" | "success" | "failure"
) {
  const title =
    state === "pending"
      ? `Deploying ${event.repository.name}`
      : state === "success"
      ? `Deployed ${event.repository.name}`
      : `Error deploying ${event.repository.name}`;
  const color =
    state === "pending" ? 0xffe547 : state === "success" ? 0x4bae4f : 0xcd3621;
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
    title,
    description: event.commits.map((c) => `- ${c.message}`).join("\n"),
    footer,
    color,
    timestamp: event.head_commit?.timestamp,
    url: event.compare,
  };
}
