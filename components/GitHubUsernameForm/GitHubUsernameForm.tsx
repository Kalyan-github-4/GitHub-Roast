"use client"

import { FormEvent } from "react"
import { BrutalistInput } from "@/components/ui/BrutalistInput"
import { BrutalistButton } from "@/components/shared/BrutalistButton"
import { useGitHubAnalysis } from "@/hooks/useGitHubAnalysis"
import { GitHubAnalysisResult } from "@/components/GitHubUsernameForm/GitHubAnalysisResult"
import { BrutalistContainer } from "@/components/shared/BrutalistContainer"

const loadingQuips = [
  "Digging through your commit graveyard... 🪦",
  "Counting 'fix: fix the fix' commits... 😐",
  "Generating personalized humiliation... 😈",
  "Reading your README-less repos... 📭",
  "Consulting the Council of Senior Devs... 👴",
]

export function GitHubUsernameForm() {
  const {
    username,
    setUsername,
    analysis,
    error,
    isLoading,
    handleSubmit,
  } = useGitHubAnalysis()

  const quip = loadingQuips[Math.floor(Date.now() / 3000) % loadingQuips.length]

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    handleSubmit(event)
  }

  return (
    <div className="w-full max-w-6xl">
      {/* Form card */}
      <div className="border-[2.5px] border-foreground bg-card brutal-shadow-xl p-6 sm:p-8">
        {/* Section label */}
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Step 1 of 1 — Enter the victim
        </p>

        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <span
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-muted-foreground text-sm"
              aria-hidden
            >
              github.com/
            </span>
            <BrutalistInput
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="torvalds"
              disabled={isLoading}
              className="w-full pl-[7.5rem]"
              aria-label="GitHub username"
            />
          </div>

          <BrutalistButton
            id="roast-submit-btn"
            type="submit"
            disabled={isLoading}
            variant="primary"
            className={`h-12 px-8 ${isLoading ? "shake" : ""}`}
          >
            {isLoading ? "Roasting... 🔥" : "Roast me 🔥"}
          </BrutalistButton>
        </form>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-4 flex items-center gap-3 rounded-none border-[2px] border-dashed border-foreground/30 bg-muted p-3">
            <span className="text-lg animate-spin">⚙️</span>
            <p className="font-mono text-sm font-medium text-muted-foreground">
              {quip}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        {!analysis && !isLoading && (
          <p className="mt-3 text-center font-mono text-xs text-muted-foreground">
            We only read public data. No sneaky stuff, we promise 🤞
          </p>
        )}
      </div>

      {/* Error state */}
      {error && (
        <BrutalistContainer
          variant="error"
          className="mt-4 p-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">😬</span>
            <div>
              <p className="font-bold font-mono text-sm uppercase tracking-wider">Something went wrong</p>
              <p className="mt-1 text-sm opacity-90">{error}</p>
            </div>
          </div>
        </BrutalistContainer>
      )}

      {/* Results */}
      {analysis && <GitHubAnalysisResult analysis={analysis} />}
    </div>
  )
}