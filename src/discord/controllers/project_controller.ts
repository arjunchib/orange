import type { $focus, $slash } from "peach";
import type { add_project, list_project } from "../commands";
import { $ } from "bun";
import { db } from "../../db";
import { projects } from "../../../db/schema";
import { inject } from "../../util";
import { GithubService } from "../../services/github_service";
import { eq } from "drizzle-orm";

export class ProjectController {
  private githubService = inject(GithubService);

  async add(interaction: $slash<typeof add_project>) {
    const { name } = interaction.options();
    const repos = await this.githubService.repos();
    const repo = repos.find((r) => r.name === name);
    if (!repo) throw new Error("Cannot find repo");
    await $`git clone ${repo.clone_url}`.cwd(Bun.env.PROJECT_FOLDER!);
    await db.insert(projects).values({ name });
    await interaction.respondWith(`Added *${name}*`);
  }

  async list(interaction: $slash<typeof list_project>) {
    const projects = await db.query.projects.findMany();
    await interaction.respondWith(
      projects.map((p) => p.name).join(", ") || "No projects yet!"
    );
  }

  async delete(interaction: $slash<typeof add_project>) {
    const { name } = interaction.options();
    const deleted_projects = await db
      .delete(projects)
      .where(eq(projects.name, name))
      .returning();
    // haha is this crazy idk!
    await $`rm -rf ./${name}`.cwd(Bun.env.PROJECT_FOLDER!);
    await interaction.respondWith(
      `Deleted ${deleted_projects.map((p) => `*${p.name}*`).join(", ")}`
    );
  }

  async autocompleteRepo(interaction: $focus<string>) {
    const name = interaction.focus();
    const repos = (await this.githubService.repos()).filter((r) => !r.archived);
    const choices = repos
      .filter((repo) => repo.name.startsWith(name))
      .slice(0, 25)
      .map((repo) => repo.name);
    await interaction.respondWith(choices);
  }

  async autocompleteName(interaction: $focus<string>) {
    const name = interaction.focus();
    const projects = await db.query.projects.findMany();
    const choices = projects
      .filter((project) => project.name.startsWith(name))
      .slice(0, 25)
      .map((project) => project.name);
    await interaction.respondWith(choices);
  }
}
