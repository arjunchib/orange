import { Octokit } from "octokit";

export const octokit = new Octokit({ auth: Bun.env.GITHUB_PAT! });
