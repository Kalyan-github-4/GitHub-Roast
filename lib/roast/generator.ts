import seedrandom from "seedrandom"

import {
  roastTemplates,
  type RoastContext,
  type RoastSeverity,
  type RoastTemplate,
} from "@/lib/roast/templates"

const severityWeight: Record<RoastSeverity, number> = {
  mild: 1,
  spicy: 2,
  brutal: 3,
}

function seededShuffle<T>(
  items: T[],
  seed: string,
): T[] {
  const random = seedrandom(seed)
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(
      random() * (index + 1),
    )

    const currentItem = copy[index]
    const randomItem = copy[randomIndex]

    if (
      currentItem === undefined ||
      randomItem === undefined
    ) {
      continue
    }

    copy[index] = randomItem
    copy[randomIndex] = currentItem
  }

  return copy
}

function matchesSeverity(
  template: RoastTemplate,
  selectedSeverity: RoastSeverity,
) {
  return (
    severityWeight[template.severity] <=
    severityWeight[selectedSeverity]
  )
}

export function generateRoastMessages(
  context: RoastContext,
  severity: RoastSeverity = "brutal",
  limit = 5,
) {
  const seed = [
    context.username.toLowerCase(),
    context.overallScore,
    context.totalRepos,
    context.totalStars,
    context.missingReadmes,
    context.genericCommitRatio.toFixed(2),
  ].join("-")

  const eligibleTemplates = roastTemplates.filter(
    (template) =>
      matchesSeverity(template, severity) &&
      template.condition(context),
  )

  const shuffledTemplates = seededShuffle<RoastTemplate>(
    eligibleTemplates,
    seed,
  )

  const usedCategories = new Set<string>()
  const selectedTemplates: RoastTemplate[] = []

  for (const template of shuffledTemplates) {
    if (usedCategories.has(template.category)) {
      continue
    }

    selectedTemplates.push(template)
    usedCategories.add(template.category)

    if (selectedTemplates.length === limit) {
      break
    }
  }

  if (selectedTemplates.length < limit) {
    for (const template of shuffledTemplates) {
      if (
        selectedTemplates.some(
          (selected) => selected.id === template.id,
        )
      ) {
        continue
      }

      selectedTemplates.push(template)

      if (selectedTemplates.length === limit) {
        break
      }
    }
  }

  return selectedTemplates.map((template) => ({
    id: template.id,
    category: template.category,
    severity: template.severity,
    message: template.message(context),
  }))
}

export function generateMainRoast(
  messages: Array<{ message: string }>,
) {
  // Pick the first 2 messages and stitch them together more naturally
  const [first, second] = messages
  if (!first) return ""
  if (!second) return first.message

  // Humanize the join — make it feel like one flowing paragraph
  const connectors = [
    " And honestly? ",
    " Oh and also — ",
    " But wait, there's more: ",
    " On top of that, ",
    " Meanwhile, ",
  ]

  // Deterministic connector choice based on message content length
  const connector = connectors[(first.message.length + second.message.length) % connectors.length]

  return `${first.message}${connector}${second.message}`
}

export function getDeveloperArchetype(
  context: RoastContext,
): string {
  // Score-based first
  if (context.overallScore < 20) {
    return "The Legend of Their Own Imagination"
  }

  if (context.overallScore >= 88) {
    return "The Insufferably Organized Developer"
  }

  // Behavior-based archetypes
  if (
    context.missingReadmes >= 5 &&
    context.staleRepos >= 4
  ) {
    return "The Repo Hoarder Who Will 'Clean This Up Later'"
  }

  if (context.genericCommitRatio >= 0.4) {
    return "The 'fix: fix the fix' Merchant"
  }

  if (context.genericCommitRatio >= 0.3) {
    return "The Update-Everything-Say-Nothing Developer"
  }

  if (
    context.conventionalCommitRatio >= 0.6 &&
    context.overallScore >= 75
  ) {
    return "The Suspiciously Competent One"
  }

  if (
    context.forkedRepos > 0 &&
    context.totalRepos > 0 &&
    context.forkedRepos / context.totalRepos >= 0.65
  ) {
    return "The Professional Fork Collector"
  }

  if (
    context.originalRepos >= 15 &&
    context.totalStars < 5
  ) {
    return "The Unsung Hero Shipping Into the Void"
  }

  if (context.staleRepos >= 6) {
    return "The Side Project Graveyard Curator"
  }

  if (context.topLanguage === "TypeScript") {
    return "The Type-Safe Chaos Agent"
  }

  if (context.topLanguage === "Rust") {
    return "The Borrow Checker Survivor"
  }

  if (context.topLanguage === "PHP") {
    return "The PHP Enjoyer (No Judgment*)"
  }

  if (context.totalStars >= 500) {
    return "The Accidental Internet Famous Developer"
  }

  return "The Eternal Side-Project Optimist"
}