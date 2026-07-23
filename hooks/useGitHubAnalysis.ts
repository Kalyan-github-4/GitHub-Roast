import { useState, FormEvent } from "react"
import type { GitHubProfileAnalysis } from "@/types/github"

type ApiResponse = {
  success: boolean
  data?: GitHubProfileAnalysis
  error?: string
}

export function useGitHubAnalysis() {
  const [username, setUsername] = useState("")
  const [analysis, setAnalysis] = useState<GitHubProfileAnalysis | null>(null)
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalizedUsername }),
      })

      const result = (await response.json()) as ApiResponse

      if (!response.ok || !result.data) {
        throw new Error(result.error ?? "Failed to analyze GitHub profile")
      }

      setAnalysis(result.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    username,
    setUsername,
    analysis,
    error,
    isLoading,
    handleSubmit,
  }
}