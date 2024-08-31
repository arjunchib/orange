import type { $slash } from "peach";
import type { deleteEnv, setEnv } from "../commands";

export class EnvController {
  async set(interaction: $slash<typeof setEnv>) {
    const { name, value } = interaction.options();
    await interaction.respondWith(`Updated \`${name}\` with \`${value}\``);
  }

  async delete(interaction: $slash<typeof deleteEnv>) {
    const { name } = interaction.options();
    await interaction.respondWith(`Deleted \`${name}\``);
  }
}
