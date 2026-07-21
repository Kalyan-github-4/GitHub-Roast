"use client"

import { FormEvent, useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { GitHubProfileAnalysis } from "@/types/github"

type ApiResponse = {
  success: boolean
  data?: GitHubProfileAnalysis
  error?: string
}

export function GitHubUsernameForm() {
  const [username, setUsername] = useState("")
  const [analysis, setAnalysis] =
    useState<GitHubProfileAnalysis | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedUsername = username.trim()

    if (!normalizedUsername) {
      setError("Enter a GitHub username")
      return
    }

    setError("")
    setAnalysis(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: normalizedUsername,
        }),
      })

      const result = (await response.json()) as ApiResponse

      if (!response.ok || !result.data) {
        throw new Error(
          result.error ?? "Failed to analyze GitHub profile",
        )
      }

      setAnalysis(result.data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-2xl border bg-card p-3 sm:flex-row"
      >
        <Input
          value={username}
          onChange={(event: any) => setUsername(event.target.value)}
          placeholder="Enter GitHub username"
          disabled={isLoading}
          className="h-12 flex-1"
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 px-6"
        >
          {isLoading ? "Analyzing..." : "Roast profile"}
        </Button>
      </form>

      {error && (
        <p className="mt-3 text-center text-sm text-destructive">
          {error}
        </p>
      )}

      {analysis && (
        <section className="mt-8 rounded-3xl border bg-card p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Image
              src={analysis.profile.avatarUrl}
              alt={`${analysis.profile.username}'s avatar`}
              width={96}
              height={96}
              className="size-24 rounded-2xl"
            />

            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">
                GitHub profile
              </p>

              <h2 className="text-2xl font-semibold">
                {analysis.profile.name ??
                  analysis.profile.username}
              </h2>

              <p className="text-muted-foreground">
                @{analysis.profile.username}
              </p>

              {analysis.profile.bio && (
                <p className="mt-2">
                  {analysis.profile.bio}
                </p>
              )}
            </div>

            <Button variant="outline">
              <a
                href={analysis.profile.profileUrl}
                target="_blank"
                rel="noreferrer"
              >
                View GitHub
              </a>
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard
              label="Public repos"
              value={analysis.profile.publicRepos}
            />

            <MetricCard
              label="Total stars"
              value={analysis.repositories.totalStars}
            />

            <MetricCard
              label="Followers"
              value={analysis.profile.followers}
            />

            <MetricCard
              label="Missing descriptions"
              value={
                analysis.repositories.reposWithoutDescription
              }
            />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <MetricCard
              label="Original repos"
              value={
                analysis.repositories.originalRepositories
              }
            />

            <MetricCard
              label="Forked repos"
              value={
                analysis.repositories.forkedRepositories
              }
            />

            <MetricCard
              label="Archived repos"
              value={
                analysis.repositories.archivedRepositories
              }
            />
          </div>

          <div className="mt-8">
            <h3 className="font-medium">Top languages</h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.repositories.topLanguages.map(
                (language) => (
                  <span
                    key={language.name}
                    className="rounded-full border bg-muted px-3 py-1 text-sm"
                  >
                    {language.name} · {language.count}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

type MetricCardProps = {
  label: string
  value: number
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <article className="rounded-2xl border bg-muted/40 p-4">
      <p className="text-2xl font-semibold">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        {label}
      </p>
    </article>
  )
}