import type { Embed, WebhookResponse } from "./types";

interface ExecuteWebhookParmas {
  content?: string;
  embeds?: Embed[];
}

interface ExecuteWebhookOptions {
  wait?: boolean;
}

export async function executeWebhook(
  url: URL | string,
  payload: ExecuteWebhookParmas,
  options?: ExecuteWebhookOptions
) {
  if (typeof url === "string") {
    url = new URL(url);
  }
  if (options) {
    url.search = "?" + new URLSearchParams(options as any).toString();
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return (await res.json()) as WebhookResponse;
}
