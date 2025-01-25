import type { $focus, $slash } from "peach";
import type { add_project } from "../commands";
import { octokit } from "../../octokit";
import { $ } from "bun";
import { db } from "../../db";
import { projects } from "../../../db/schema";

export class ProjectController {
  async add(interaction: $slash<typeof add_project>) {
    const { name } = interaction.options();
    await db.insert(projects).values({ name });
    await $`git clone `;
    await interaction.respondWith(name);
  }

  async autocompleteName(interaction: $focus<string>) {
    const name = interaction.focus();
    const repos = await octokit.paginate(
      octokit.rest.repos.listForAuthenticatedUser,
      {
        per_page: 100,
      }
    );
    const choices = repos
      .filter((repo) => repo.name.startsWith(name))
      .slice(0, 25)
      .map((repo) => repo.name);
    await interaction.respondWith(choices);
  }
}
