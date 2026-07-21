import "server-only"

import { Octokit } from "octokit"

const githubToken = process.env.GITHUB_TOKEN

if (!githubToken) {
  throw new Error("GITHUB_TOKEN is missing from .env.local")
}

export const octokit = new Octokit({
  auth: githubToken,
  userAgent: "github-roast-app",
})