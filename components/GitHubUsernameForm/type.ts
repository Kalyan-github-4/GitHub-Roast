import type { GitHubProfileAnalysis } from "@/types/github"

export interface GitHubUsernameFormProps {
  onAnalysisComplete?: (analysis: GitHubProfileAnalysis) => void
}

export interface ApiResponse {
  success: boolean
  data?: GitHubProfileAnalysis
  error?: string
}