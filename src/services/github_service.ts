import { Octokit } from "octokit";
import { subMinutes } from "date-fns";

export class GithubService {
  private octokit = new Octokit({ auth: Bun.env.GITHUB_PAT! });
  private cached_repos?: Awaited<ReturnType<typeof this.fetch_repos>>;
  private repos_last_checked = new Date();

  async repos() {
    if (!this.cached_repos || this.repos_stale()) {
      this.repos_last_checked = new Date();
      this.cached_repos = await this.fetch_repos();
    }
    return this.cached_repos;
  }

  private repos_stale() {
    return subMinutes(new Date(), 5) > this.repos_last_checked;
  }

  private async fetch_repos() {
    return await this.octokit.paginate(
      this.octokit.rest.repos.listForAuthenticatedUser,
      {
        per_page: 100,
      }
    );
  }
}
