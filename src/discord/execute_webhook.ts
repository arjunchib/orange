import type { Embed, WebhookResponse } from "./types";

interface ExecuteWebhookParmas {
  embeds: Embed[];
}

interface ExecuteWebhookOptions {
  wait?: boolean;
}

export async function executeWebhook(
  payload: ExecuteWebhookParmas,
  options?: ExecuteWebhookOptions
) {
  const url = new URL(Bun.env.DISCORD_WEBHOOK!);
  if (options) {
    url.search = "?" + new URLSearchParams(options as any).toString();
  }
  console.log(url);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as WebhookResponse;
}
