export type RepositoryAnalysis = {
    name: string
    url: string
    description: string | null
    language: string | null
    stars: number
    forks: number
    isArchived: boolean
    isStale: boolean
    hasReadme: boolean
    hasLicense: boolean
    lastPushedAt: string | null
}

export type CommitAnalysis = {
    analyzedCount: number
    genericMessageCount: number
    genericMessageRatio: number
    conventionalCommitCount: number
    conventionalCommitRatio: number
    averageMessageLength: number
    suspiciousMessages: string[]
}

export type GeneratedRoastMessage = {
    id: string
    category: string
    severity: "mild" | "spicy" | "brutal"
    message: string
}

export type GitHubProfileAnalysis = {
    profile: {
        username: string
        name: string | null
        avatarUrl: string
        bio: string | null
        profileUrl: string
        followers: number
        following: number
        publicRepos: number
        accountCreatedAt: string
    }

    roast: {
        archetype: string
        mainMessage: string
        messages: GeneratedRoastMessage[]
    }
    
    repositories: {
        analyzedCount: number
        totalStars: number
        totalForks: number
        originalRepositories: number
        forkedRepositories: number
        reposWithoutDescription: number
        reposWithoutReadme: number
        reposWithoutLicense: number
        staleRepositories: number
        archivedRepositories: number

        topLanguages: Array<{
            name: string
            count: number
        }>

        analyzedRepositories: RepositoryAnalysis[]
    }

    commits: CommitAnalysis

    scores: {
        documentation: number
        commitHygiene: number
        projectQuality: number
        overall: number
    }
}