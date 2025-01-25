import { bootstrapWebhook } from "peach";
import { commands } from "./commands";
import { routes } from "./routes";

export const usePeach = await bootstrapWebhook({
  applicationId: Bun.env.DISCORD_APPLICATION_ID!,
  publicKey: Bun.env.DISCORD_PUBLIC_KEY!,
  syncCommands: {
    guildId: Bun.env.DISCORD_GUILD_ID!,
  },
  commands,
  routes,
  token: Bun.env.DISCORD_BOT_TOKEN!,
  // debug: true,
});
