import { NextResponse } from "next/server"
import { z } from "zod"

import { analyzeRepositories } from "@/lib/github/analyzer"
import { octokit } from "@/lib/github/client"
import { calculateScores } from "@/lib/github/scoring"
import type { GitHubProfileAnalysis } from "@/types/github"
import {
    generateMainRoast,
    generateRoastMessages,
    getDeveloperArchetype,
} from "@/lib/roast/generator"

const requestSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, "GitHub username is required")
        .max(39, "Invalid GitHub username")
        .regex(
            /^(?!-)(?!.*--)[a-zA-Z0-9-]+(?<!-)$/,
            "Invalid GitHub username",
        ),
})

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json()
        const validation = requestSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        validation.error.issues[0]?.message ??
                        "Invalid request",
                },
                { status: 400 },
            )
        }

        const username = validation.data.username

        const [userResponse, repositories] = await Promise.all([
            octokit.rest.users.getByUsername({
                username,
            }),

            octokit.paginate(octokit.rest.repos.listForUser, {
                username,
                type: "owner",
                sort: "updated",
                direction: "desc",
                per_page: 100,
            }),
        ])

        const user = userResponse.data

        const languageCounts = new Map<string, number>()

        for (const repository of repositories) {
            if (!repository.language) continue

            languageCounts.set(
                repository.language,
                (languageCounts.get(repository.language) ?? 0) + 1,
            )
        }

        const originalRepositories = repositories.filter(
            (repository) => !repository.fork,
        )

        const normalizedRepositories = originalRepositories.map(
            (repository) => ({
                name: repository.name,
                html_url: repository.html_url,
                description: repository.description ?? null,
                language: repository.language ?? null,
                stargazers_count: repository.stargazers_count ?? 0,
                forks_count: repository.forks_count ?? 0,
                archived: repository.archived ?? false,
                pushed_at: repository.pushed_at ?? null,
                license: repository.license
                    ? {
                        key: repository.license.key,
                        name: repository.license.name,
                        spdx_id: repository.license.spdx_id ?? null,
                    }
                    : null,
            }),
        )

        const detailedAnalysis = await analyzeRepositories(
            username,
            normalizedRepositories,
        )

        const topLanguages = Array.from(languageCounts.entries())
            .map(([name, count]) => ({
                name,
                count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        const totalStars = repositories.reduce(
            (total, repository) =>
                total + (repository.stargazers_count ?? 0),
            0,
        )

        const totalForks = repositories.reduce(
            (total, repository) =>
                total + (repository.forks_count ?? 0),
            0,
        )

        const analyzedReposWithoutDescription =
            detailedAnalysis.analyzedRepositories.filter(
                (repository) => !repository.description,
            ).length

        const scores = calculateScores({
            analyzedRepoCount:
                detailedAnalysis.repositoryMetrics.analyzedCount,

            reposWithoutDescription:
                analyzedReposWithoutDescription,

            reposWithoutReadme:
                detailedAnalysis.repositoryMetrics.reposWithoutReadme,

            reposWithoutLicense:
                detailedAnalysis.repositoryMetrics.reposWithoutLicense,

            staleRepositories:
                detailedAnalysis.repositoryMetrics.staleRepositories,

            genericCommitRatio:
                detailedAnalysis.commitMetrics.genericMessageRatio,

            conventionalCommitRatio:
                detailedAnalysis.commitMetrics.conventionalCommitRatio,

            totalStars,
        })
        const roastContext = {
            username: user.login,
            totalRepos: repositories.length,
            totalStars,
            originalRepos: originalRepositories.length,
            forkedRepos: repositories.filter(
                (repository) => repository.fork,
            ).length,
            missingDescriptions:
                analyzedReposWithoutDescription,
            missingReadmes:
                detailedAnalysis.repositoryMetrics.reposWithoutReadme,
            missingLicenses:
                detailedAnalysis.repositoryMetrics.reposWithoutLicense,
            staleRepos:
                detailedAnalysis.repositoryMetrics.staleRepositories,
            genericCommitRatio:
                detailedAnalysis.commitMetrics.genericMessageRatio,
            conventionalCommitRatio:
                detailedAnalysis.commitMetrics.conventionalCommitRatio,
            suspiciousMessages:
                detailedAnalysis.commitMetrics.suspiciousMessages,
            topLanguage: topLanguages[0]?.name,
            overallScore: scores.overall,
        }

        const roastMessages = generateRoastMessages(
            roastContext,
            "brutal",
            5,
        )

        const roast = {
            archetype: getDeveloperArchetype(roastContext),
            mainMessage: generateMainRoast(roastMessages),
            messages: roastMessages,
        }
        const analysis: GitHubProfileAnalysis = {
            profile: {
                username: user.login,
                name: user.name,
                avatarUrl: user.avatar_url,
                bio: user.bio,
                profileUrl: user.html_url,
                followers: user.followers,
                following: user.following,
                publicRepos: user.public_repos,
                accountCreatedAt: user.created_at,
            },

            repositories: {
                analyzedCount:
                    detailedAnalysis.repositoryMetrics.analyzedCount,

                totalStars,
                totalForks,

                originalRepositories: originalRepositories.length,

                forkedRepositories: repositories.filter(
                    (repository) => repository.fork,
                ).length,

                reposWithoutDescription:
                    analyzedReposWithoutDescription,

                reposWithoutReadme:
                    detailedAnalysis.repositoryMetrics.reposWithoutReadme,

                reposWithoutLicense:
                    detailedAnalysis.repositoryMetrics.reposWithoutLicense,

                staleRepositories:
                    detailedAnalysis.repositoryMetrics.staleRepositories,

                archivedRepositories: repositories.filter(
                    (repository) => repository.archived,
                ).length,

                topLanguages,

                analyzedRepositories:
                    detailedAnalysis.analyzedRepositories,
            },

            commits: detailedAnalysis.commitMetrics,

            scores,

            roast,
        }

        return NextResponse.json({
            success: true,
            data: analysis,
        })
    } catch (error) {
        console.error("GitHub profile analysis failed:", error)

        if (
            typeof error === "object" &&
            error !== null &&
            "status" in error
        ) {
            const status = Number(error.status)

            if (status === 404) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "GitHub user not found",
                    },
                    { status: 404 },
                )
            }

            if (status === 401) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "GitHub authentication failed. Check your token.",
                    },
                    { status: 401 },
                )
            }

            if (status === 403) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            "GitHub API rate limit reached or access denied.",
                    },
                    { status: 429 },
                )
            }
        }

        return NextResponse.json(
            {
                success: false,
                error: "Failed to analyze GitHub profile",
            },
            { status: 500 },
        )
    }
}