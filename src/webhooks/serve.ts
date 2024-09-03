import { verifySignature } from "./validate";
import type { WebhookEventName } from "@octokit/webhooks-types";
import { handlePushEvent } from "./event_handlers";
import { bootstrapWebhook } from "peach";
import { commands } from "../discord/commands";
import { routes } from "../discord/routes";
import { editWebhook } from "../discord/edit_webhook";
import { unlink } from "fs/promises";
import { readJSON } from "../util";
import { KV } from "../kv";

const usePeach = await bootstrapWebhook({
  applicationId: Bun.env.APPLICATION_ID!,
  publicKey: Bun.env.PUBLIC_KEY!,
  syncCommands: {
    guildId: Bun.env.GUILD_ID!,
  },
  commands,
  routes,
  token: Bun.env.TOKEN!,
  debug: true,
});

Bun.serve({
  port: 8000,
  async fetch(req) {
    if (req.headers.has("x-github-event")) {
      return await useGithub(req);
    } else {
      return await usePeach(req);
    }
  },
});

await sendOnStart();

async function sendOnStart() {
  const sendOnStart = KV.get("sendOnStart")?.parsedValue;
  if (sendOnStart) {
    const { webhookId, payload } = sendOnStart;
    await editWebhook(webhookId, payload);
  }
}

async function useGithub(req: Request) {
  const signature = req.headers.get("X-Hub-Signature-256");
  const secret = Bun.env.WEBHOOK_SECRET;
  const body = await req.text();
  const payload = JSON.parse(body);
  if (
    !secret ||
    !signature ||
    !(await verifySignature(secret, signature, body))
  ) {
    return new Response("Verification failed", { status: 500 });
  } else {
    const githubEvent = req.headers.get("x-github-event") as WebhookEventName;
    if (githubEvent === "push") {
      await handlePushEvent(payload);
    }
    return new Response("Accepted", { status: 202 });
  }
}
