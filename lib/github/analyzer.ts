import { octokit } from "@/lib/github/client"

const GENERIC_COMMIT_PATTERNS = [
  /^fix$/i,
  /^fixed$/i,
  /^update$/i,
  /^updated$/i,
  /^changes?$/i,
  /^test$/i,
  /^testing$/i,
  /^done$/i,
  /^wip$/i,
  /^asdf$/i,
  /^final$/i,
  /^final fix$/i,
  /^final final$/i,
  /^bug fix$/i,
  /^minor changes$/i,
  /^small changes$/i,
]

const CONVENTIONAL_COMMIT_PATTERN =
  /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?!?:\s.+/i

type RepositoryInput = {
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  archived: boolean
  pushed_at: string | null
  license?: {
    key?: string
    name?: string
    spdx_id?: string | null
  } | null
}

function isGenericCommitMessage(message: string) {
  const firstLine = message.split("\n")[0]?.trim() ?? ""

  return GENERIC_COMMIT_PATTERNS.some((pattern) =>
    pattern.test(firstLine),
  )
}

function isConventionalCommitMessage(message: string) {
  const firstLine = message.split("\n")[0]?.trim() ?? ""

  return CONVENTIONAL_COMMIT_PATTERN.test(firstLine)
}

function calculateStaleStatus(pushedAt: string | null) {
  if (!pushedAt) return true

  const lastPushDate = new Date(pushedAt)
  const staleThreshold = new Date()

  staleThreshold.setMonth(staleThreshold.getMonth() - 12)

  return lastPushDate < staleThreshold
}

async function repositoryHasReadme(
  owner: string,
  repo: string,
) {
  try {
    await octokit.rest.repos.getReadme({
      owner,
      repo,
    })

    return true
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      Number(error.status) === 404
    ) {
      return false
    }

    throw error
  }
}

async function getRepositoryCommits(
  owner: string,
  repo: string,
) {
  try {
    const response = await octokit.rest.repos.listCommits({
      owner,
      repo,
      per_page: 10,
    })

    return response.data.map(
      (commit) => commit.commit.message,
    )
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "status" in error
    ) {
      const status = Number(error.status)

      if (status === 404 || status === 409) {
        return []
      }
    }

    throw error
  }
}

export async function analyzeRepositories(
  owner: string,
  repositories: RepositoryInput[],
) {
  const selectedRepositories = repositories
    .filter((repository) => !repository.archived)
    .sort((a, b) => {
      const starDifference =
        b.stargazers_count - a.stargazers_count

      if (starDifference !== 0) {
        return starDifference
      }

      return (
        new Date(b.pushed_at ?? 0).getTime() -
        new Date(a.pushed_at ?? 0).getTime()
      )
    })
    .slice(0, 10)

  const repositoryResults = await Promise.all(
    selectedRepositories.map(async (repository) => {
      const [hasReadme, commitMessages] =
        await Promise.all([
          repositoryHasReadme(owner, repository.name),
          getRepositoryCommits(owner, repository.name),
        ])

      return {
        repository: {
          name: repository.name,
          url: repository.html_url,
          description: repository.description,
          language: repository.language,
          stars: repository.stargazers_count,
          forks: repository.forks_count,
          isArchived: repository.archived,
          isStale: calculateStaleStatus(
            repository.pushed_at,
          ),
          hasReadme,
          hasLicense: Boolean(
            repository.license?.spdx_id &&
              repository.license.spdx_id !== "NOASSERTION",
          ),
          lastPushedAt: repository.pushed_at,
        },
        commitMessages,
      }
    }),
  )

  const analyzedRepositories = repositoryResults.map(
    (result) => result.repository,
  )

  const allCommitMessages = repositoryResults.flatMap(
    (result) => result.commitMessages,
  )

  const genericMessages = allCommitMessages.filter(
    isGenericCommitMessage,
  )

  const conventionalMessages = allCommitMessages.filter(
    isConventionalCommitMessage,
  )

  const analyzedCommitCount = allCommitMessages.length

  const averageMessageLength =
    analyzedCommitCount === 0
      ? 0
      : Math.round(
          allCommitMessages.reduce(
            (total, message) =>
              total +
              (message.split("\n")[0]?.trim().length ?? 0),
            0,
          ) / analyzedCommitCount,
        )

  return {
    analyzedRepositories,

    repositoryMetrics: {
      analyzedCount: analyzedRepositories.length,

      reposWithoutReadme: analyzedRepositories.filter(
        (repository) => !repository.hasReadme,
      ).length,

      reposWithoutLicense: analyzedRepositories.filter(
        (repository) => !repository.hasLicense,
      ).length,

      staleRepositories: analyzedRepositories.filter(
        (repository) => repository.isStale,
      ).length,
    },

    commitMetrics: {
      analyzedCount: analyzedCommitCount,

      genericMessageCount: genericMessages.length,

      genericMessageRatio:
        analyzedCommitCount === 0
          ? 0
          : genericMessages.length / analyzedCommitCount,

      conventionalCommitCount:
        conventionalMessages.length,

      conventionalCommitRatio:
        analyzedCommitCount === 0
          ? 0
          : conventionalMessages.length /
            analyzedCommitCount,

      averageMessageLength,

      suspiciousMessages: genericMessages
        .map(
          (message) =>
            message.split("\n")[0]?.trim() ?? message,
        )
        .slice(0, 8),
    },
  }
}