import type { $slash } from "peach";
import type { deleteEnv, getEnv, setEnv } from "../commands";
import { readText } from "../util";

export class EnvController {
  async set(interaction: $slash<typeof setEnv>) {
    const { project, name, value } = interaction.options();
    const env = await this.getValues(project);
    env[name] = value;
    this.saveValues(project, env);
    await interaction.respondWith({
      content: `Updated \`${name}\` with \`${value}\``,
      flags: 1 << 6,
    });
  }

  async delete(interaction: $slash<typeof deleteEnv>) {
    const { project, name } = interaction.options();
    const env = await this.getValues(project);
    delete env[name];
    this.saveValues(project, env);
    await interaction.respondWith({
      content: `Deleted \`${name}\``,
      flags: 1 << 6,
    });
  }

  async get(interaction: $slash<typeof getEnv>) {
    const { project } = interaction.options();
    const env = await this.getValuesRaw(project);
    await interaction.respondWith({
      content: `\`\`\`${env}\`\`\``,
      flags: 1 << 6,
    });
  }

  private async getValuesRaw(project: string) {
    return await readText(this.envPath(project));
  }

  private async getValues(project: string) {
    const text = await this.getValuesRaw(project);
    if (!text) return {};
    return Object.fromEntries(
      text
        .split("\n")
        .filter((line) => line.includes("="))
        .map((line) => line.split("=").map((v) => v.trim()))
    );
  }

  private async saveValues(project: string, env: Record<string, string>) {
    const text = Object.entries(env)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    return await Bun.write(this.envPath(project), text);
  }

  private envPath(project: string) {
    return `../${project}/.env`;
  }
}
