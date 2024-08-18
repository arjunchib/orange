import type { Embed, WebhookResponse } from "./types";

interface ExecuteWebhookParmas {
  embeds: Embed[];
}

export async function editWebhook(
  messageId: string,
  payload: ExecuteWebhookParmas
) {
  const url = new URL(`${Bun.env.DISCORD_WEBHOOK!}/messages/${messageId}`);
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as WebhookResponse;
}
