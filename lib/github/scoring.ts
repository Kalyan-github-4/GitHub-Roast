type ScoreInput = {
  analyzedRepoCount: number
  reposWithoutDescription: number
  reposWithoutReadme: number
  reposWithoutLicense: number
  staleRepositories: number
  genericCommitRatio: number
  conventionalCommitRatio: number
  totalStars: number
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

export function calculateScores(input: ScoreInput) {
  const repositoryCount = Math.max(
    input.analyzedRepoCount,
    1,
  )

  const missingDescriptionRatio =
    input.reposWithoutDescription / repositoryCount

  const missingReadmeRatio =
    input.reposWithoutReadme / repositoryCount

  const missingLicenseRatio =
    input.reposWithoutLicense / repositoryCount

  const staleRatio =
    input.staleRepositories / repositoryCount

  const documentation = clampScore(
    100 -
      missingReadmeRatio * 45 -
      missingDescriptionRatio * 30 -
      missingLicenseRatio * 25,
  )

  const commitHygiene = clampScore(
    70 -
      input.genericCommitRatio * 60 +
      input.conventionalCommitRatio * 30,
  )

  const starBonus = Math.min(
    15,
    Math.log2(input.totalStars + 1) * 3,
  )

  const projectQuality = clampScore(
    80 -
      staleRatio * 35 -
      missingDescriptionRatio * 20 +
      starBonus,
  )

  const overall = clampScore(
    documentation * 0.35 +
      commitHygiene * 0.3 +
      projectQuality * 0.35,
  )

  return {
    documentation,
    commitHygiene,
    projectQuality,
    overall,
  }
}