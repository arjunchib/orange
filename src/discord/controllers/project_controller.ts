import type { $focus, $slash } from "peach";
import type { add_project } from "../commands";
import { octokit } from "../../octokit";

export class ProjectController {
  async add(interaction: $slash<typeof add_project>) {
    const { name } = interaction.options();
    await interaction.respondWith(name);
  }

  async autocompleteName(interaction: $focus<string>) {
    const name = interaction.focus();
    const repos = await octokit.rest.repos.listForUser({ username: "@me" });
    const choices = repos.data
      .filter((repo) => repo.name.startsWith(name))
      .map((repo) => repo.name);
    await interaction.respondWith(choices);
  }
}
