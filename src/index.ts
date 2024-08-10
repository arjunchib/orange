import { verifySignature } from "./validate";

Bun.serve({
  async fetch(req) {
    const signature = req.headers.get("X-Hub-Signature-256");
    const secret = Bun.env.WEBHOOK_SECRET;
    const body = await req.text();
    if (
      !secret ||
      !signature ||
      !(await verifySignature(secret, signature, body))
    ) {
      return new Response("Verification failed", { status: 500 });
    } else {
      const githubEvent = req.headers.get("x-github-event") as "push";
      console.log(githubEvent)
      return new Response("Accepted", { status: 202 });
    }
  },
});
