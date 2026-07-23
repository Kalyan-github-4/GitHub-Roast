import Image from "next/image"
import type { GitHubProfileAnalysis } from "@/types/github"
import { MetricCard } from "@/components/shared/MetricCard"
import { ScoreCard } from "@/components/shared/ScoreCard"
import { BrutalistContainer } from "@/components/shared/BrutalistContainer"
import { BrutalistButton } from "@/components/shared/BrutalistButton"

interface GitHubAnalysisResultProps {
  analysis: GitHubProfileAnalysis
}

// Language color dots for visual flair
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
}

const SEVERITY_STYLES: Record<string, { bg: string; label: string; emoji: string }> = {
  mild: { bg: "bg-[oklch(0.88_0.15_88)] text-foreground", label: "Mild", emoji: "😏" },
  spicy: { bg: "bg-[oklch(0.72_0.18_55)] text-foreground", label: "Spicy", emoji: "🌶️" },
  brutal: { bg: "bg-[oklch(0.60_0.22_25)] text-white", label: "Brutal", emoji: "💀" },
}

export function GitHubAnalysisResult({ analysis }: GitHubAnalysisResultProps) {
  return (
    <section className="mt-10 space-y-8 stagger slide-up">
      <ProfileHeader analysis={analysis} />
      <RoastSection analysis={analysis} />
      <RoastEvidenceSection analysis={analysis} />
      <ScoreBreakdownSection analysis={analysis} />
      <CommitCrimeReport analysis={analysis} />
      <RepositoryOverview analysis={analysis} />
      <RepositoryTable analysis={analysis} />
    </section>
  )
}

// ==================== Sub-components ====================

function ProfileHeader({ analysis }: { analysis: GitHubProfileAnalysis }) {
  return (
    <BrutalistContainer className="p-6 sm:p-8">
      {/* Top row */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Image
            src={analysis.profile.avatarUrl}
            alt={`${analysis.profile.username}'s GitHub avatar`}
            width={100}
            height={100}
            className="border-[2.5px] border-foreground object-cover brutal-shadow"
            style={{ imageRendering: "auto" }}
          />
          {/* Tape decoration */}
          <div
            aria-hidden
            className="absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 rotate-[-2deg] border border-[oklch(0.72_0.12_80)] bg-[oklch(0.88_0.15_88_/_65%)]"
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            🔍 GitHub profile roasted
          </p>

          <h2 className="mt-2 font-heading text-3xl font-extrabold uppercase leading-tight sm:text-4xl">
            {analysis.profile.name ?? analysis.profile.username}
          </h2>

          <a
            href={analysis.profile.profileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block font-mono text-base font-bold text-[oklch(0.60_0.22_25)] hover:underline underline-offset-4"
          >
            @{analysis.profile.username}
          </a>

          {analysis.profile.bio && (
            <p className="mt-3 max-w-2xl text-base leading-6 text-muted-foreground">
              &ldquo;{analysis.profile.bio}&rdquo;
            </p>
          )}
        </div>

        <BrutalistButton variant="outline" asChild>
          <a href={analysis.profile.profileUrl} target="_blank" rel="noreferrer">
            View on GitHub ↗
          </a>
        </BrutalistButton>
      </div>

      {/* Stats grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <MetricCard emoji="📦" label="Public repos" value={analysis.profile.publicRepos} />
        <MetricCard emoji="⭐" label="Total stars" value={analysis.repositories.totalStars} />
        <MetricCard emoji="👥" label="Followers" value={analysis.profile.followers} />
        <MetricCard emoji="📭" label="No description" value={analysis.repositories.reposWithoutDescription} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <MetricCard emoji="🛠️" label="Original repos" value={analysis.repositories.originalRepositories} />
        <MetricCard emoji="🍴" label="Forked repos" value={analysis.repositories.forkedRepositories} />
        <MetricCard emoji="🗃️" label="Archived repos" value={analysis.repositories.archivedRepositories} />
      </div>

      {/* Top languages */}
      <div className="mt-8">
        <h3 className="font-heading text-sm font-extrabold uppercase tracking-widest text-muted-foreground">
          Top languages
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {analysis.repositories.topLanguages.map((language) => (
            <span
              key={language.name}
              className="flex items-center gap-1.5 border-[2px] border-foreground bg-background px-3 py-1.5 font-mono text-xs font-bold"
            >
              <span
                className="size-2.5 rounded-full border border-foreground/20"
                style={{
                  backgroundColor: LANG_COLORS[language.name] ?? "#888",
                }}
                aria-hidden
              />
              {language.name}
              <span className="opacity-50">·</span>
              <span className="opacity-70">{language.count}</span>
            </span>
          ))}
        </div>
      </div>
    </BrutalistContainer>
  )
}

function RoastSection({ analysis }: { analysis: GitHubProfileAnalysis }) {
  return (
    <BrutalistContainer variant="roast" className="relative p-6 sm:p-10">
      {/* Noise overlay for texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] noise" aria-hidden />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] opacity-60">
            🔥 The verdict is in
          </p>
          <h3 className="mt-3 font-heading text-4xl font-extrabold uppercase leading-tight sm:text-6xl wiggle">
            {analysis.roast.archetype}
          </h3>
        </div>
        <span className="stamp shrink-0 !rotate-[2deg]" aria-label="Brutal mode active">
          💀 BRUTAL MODE
        </span>
      </div>

      <div className="mt-6 border-t border-white/20 pt-6">
        <p className="max-w-5xl text-lg font-semibold leading-8 opacity-90">
          {analysis.roast.mainMessage}
        </p>
      </div>
    </BrutalistContainer>
  )
}

function RoastEvidenceSection({ analysis }: { analysis: GitHubProfileAnalysis }) {
  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-heading text-2xl font-extrabold uppercase">
          Roast evidence 🧾
        </h3>
        <span className="stamp">Exhibit A through {analysis.roast.messages.length}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {analysis.roast.messages.map((roastMessage, index) => {
          const sev = SEVERITY_STYLES[roastMessage.severity] ?? SEVERITY_STYLES.mild
          return (
            <BrutalistContainer key={roastMessage.id} className="group relative p-5 transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
              {/* Number */}
              <div className="flex items-start justify-between gap-4">
                <span className="font-heading text-5xl font-extrabold leading-none text-foreground/15 select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`border-[2px] border-foreground px-2 py-0.5 font-mono text-xs font-extrabold uppercase ${sev.bg}`}
                  >
                    {sev.emoji} {sev.label}
                  </span>
                  <span className="border-[2px] border-foreground bg-background px-2 py-0.5 font-mono text-xs font-bold uppercase text-muted-foreground">
                    {roastMessage.category}
                  </span>
                </div>
              </div>

              {/* Message */}
              <p className="mt-4 text-base font-medium leading-7">
                {roastMessage.message}
              </p>
            </BrutalistContainer>
          )
        })}
      </div>
    </div>
  )
}

function ScoreBreakdownSection({ analysis }: { analysis: GitHubProfileAnalysis }) {
  return (
    <div>
      <h3 className="mb-5 font-heading text-2xl font-extrabold uppercase">
        Score breakdown 📊
      </h3>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ScoreCard
          emoji="📖"
          label="Documentation"
          value={analysis.scores.documentation}
          variant="yellow"
        />
        <ScoreCard
          emoji="🧹"
          label="Commit hygiene"
          value={analysis.scores.commitHygiene}
          variant="blue"
        />
        <ScoreCard
          emoji="🏗️"
          label="Project quality"
          value={analysis.scores.projectQuality}
          variant="purple"
        />
        <ScoreCard
          emoji="🎯"
          label="Overall score"
          value={analysis.scores.overall}
          variant="red"
        />
      </div>
    </div>
  )
}

function CommitCrimeReport({ analysis }: { analysis: GitHubProfileAnalysis }) {
  return (
    <BrutalistContainer className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-heading text-2xl font-extrabold uppercase">
          Commit crime report 🚔
        </h3>
        <span
          className="font-mono text-xs font-bold uppercase tracking-wider"
          style={{ color: "oklch(0.60 0.22 25)" }}
        >
          Case No. #{analysis.profile.username.slice(0, 6).toUpperCase()}
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard emoji="🔬" label="Analyzed commits" value={analysis.commits.analyzedCount} />
        <MetricCard emoji="🤦" label="Generic messages" value={analysis.commits.genericMessageCount} />
        <MetricCard emoji="✅" label="Conventional commits" value={analysis.commits.conventionalCommitCount} />
        <MetricCard emoji="📏" label="Avg message length" value={analysis.commits.averageMessageLength} />
      </div>

      {analysis.commits.suspiciousMessages.length > 0 && (
        <div className="mt-6 border-t-[2px] border-dashed border-foreground/20 pt-6">
          <p className="mb-3 font-mono text-xs font-extrabold uppercase tracking-[0.2em] text-muted-foreground">
            🚨 Hall of shame — actual commit messages found
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.commits.suspiciousMessages.map((message, index) => (
              <span
                key={`${message}-${index}`}
                className="border-[2px] border-foreground bg-[oklch(0.60_0.22_25)] px-3 py-1.5 font-mono text-sm font-bold text-white"
              >
                &ldquo;{message}&rdquo;
              </span>
            ))}
          </div>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            A senior dev somewhere just shuddered. They don't know why. They know.
          </p>
        </div>
      )}
    </BrutalistContainer>
  )
}

function RepositoryOverview({ analysis }: { analysis: GitHubProfileAnalysis }) {
  return (
    <BrutalistContainer className="p-6 sm:p-8">
      <h3 className="font-heading text-2xl font-extrabold uppercase">
        Repository overview 📁
      </h3>

      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard emoji="🔭" label="Analyzed repos" value={analysis.repositories.analyzedCount} />
        <MetricCard emoji="😶" label="Missing README" value={analysis.repositories.reposWithoutReadme} />
        <MetricCard emoji="⚖️" label="Missing license" value={analysis.repositories.reposWithoutLicense} />
        <MetricCard emoji="🧟" label="Stale repos" value={analysis.repositories.staleRepositories} />
        <MetricCard emoji="🤐" label="No description" value={analysis.repositories.reposWithoutDescription} />
      </div>
    </BrutalistContainer>
  )
}

function RepositoryTable({ analysis }: { analysis: GitHubProfileAnalysis }) {
  return (
    <BrutalistContainer className="overflow-x-auto p-6 sm:p-8">
      <h3 className="font-heading text-2xl font-extrabold uppercase">
        Analyzed repositories 🗂️
      </h3>

      <table className="mt-5 min-w-full border-collapse text-left">
        <thead>
          <tr className="border-b-[2.5px] border-foreground">
            {["Repository", "Language", "⭐", "README", "License", "Status"].map((col) => (
              <th
                key={col}
                className="px-3 py-3 font-mono text-xs font-extrabold uppercase tracking-widest text-muted-foreground"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {analysis.repositories.analyzedRepositories.map((repository, i) => (
            <tr
              key={repository.name}
              className={`border-b border-foreground/10 transition-colors hover:bg-muted/50 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
            >
              <td className="px-3 py-4">
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[oklch(0.60_0.22_25)] underline-offset-4 hover:underline"
                >
                  {repository.name}
                </a>
              </td>
              <td className="px-3 py-4">
                {repository.language ? (
                  <span className="flex items-center gap-1.5 font-mono text-sm">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: LANG_COLORS[repository.language] ?? "#888" }}
                      aria-hidden
                    />
                    {repository.language}
                  </span>
                ) : (
                  <span className="font-mono text-sm text-muted-foreground">—</span>
                )}
              </td>
              <td className="px-3 py-4 font-mono text-sm font-bold">
                {repository.stars > 0 ? repository.stars : <span className="opacity-40">0</span>}
              </td>
              <td className="px-3 py-4">
                <span className={`font-mono text-xs font-extrabold uppercase ${repository.hasReadme ? "text-[oklch(0.62_0.16_145)]" : "text-[oklch(0.60_0.22_25)]"}`}>
                  {repository.hasReadme ? "✓ Yes" : "✗ No"}
                </span>
              </td>
              <td className="px-3 py-4">
                <span className={`font-mono text-xs font-extrabold uppercase ${repository.hasLicense ? "text-[oklch(0.62_0.16_145)]" : "text-muted-foreground"}`}>
                  {repository.hasLicense ? "✓ Yes" : "✗ No"}
                </span>
              </td>
              <td className="px-3 py-4">
                <span
                  className={`border-[2px] border-foreground px-2 py-0.5 font-mono text-xs font-extrabold uppercase ${
                    repository.isStale
                      ? "bg-[oklch(0.88_0.15_88)] text-foreground"
                      : "bg-[oklch(0.62_0.16_145)] text-white"
                  }`}
                >
                  {repository.isStale ? "🧟 Stale" : "✅ Active"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </BrutalistContainer>
  )
}