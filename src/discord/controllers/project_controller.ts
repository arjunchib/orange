import type { $focus, $slash } from "peach";
import type { add_project } from "../commands";
import { $ } from "bun";
import { db } from "../../db";
import { projects } from "../../../db/schema";
import { inject } from "../../util";
import { GithubService } from "../../services/github_service";

export class ProjectController {
  private githubService = inject(GithubService);

  async add(interaction: $slash<typeof add_project>) {
    const { name } = interaction.options();
    await db.insert(projects).values({ name });
    await $`git clone `;
    await interaction.respondWith(name);
  }

  async autocompleteName(interaction: $focus<string>) {
    const name = interaction.focus();
    const repos = (await this.githubService.repos()).filter((r) => !r.archived);
    const choices = repos
      .filter((repo) => repo.name.startsWith(name))
      .slice(0, 25)
      .map((repo) => repo.name);
    await interaction.respondWith(choices);
  }
}
