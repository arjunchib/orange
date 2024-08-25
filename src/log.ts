import { executeWebhook } from "./discord/execute_webhook";

export async function logError(e: Error | string | any) {
  let content: string;
  if (e instanceof Error) {
    content = `\`\`\`ts
${e.stack}
\`\`\``;
  } else {
    content = e.toString();
  }

  await executeWebhook(Bun.env.ERROR_WEBHOOK!, { content });
}
