import type { WebhookEventName } from "@octokit/webhooks-types";
import { handlePushEvent } from "./event_handlers";
import { verifySignature } from "./validate";

export async function useGithub(req: Request) {
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
