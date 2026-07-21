import { GitHubUsernameForm } from "@/components/github-username-form"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-4 py-20 text-foreground">
      <section className="mx-auto flex max-w-5xl flex-col items-center">
        <p className="rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          Your commits are about to be judged
        </p>

        <h1 className="mt-6 max-w-3xl text-center text-4xl font-bold tracking-tight sm:text-6xl">
          Roast your GitHub profile
        </h1>

        <p className="mt-5 max-w-2xl text-center text-base leading-7 text-muted-foreground sm:text-lg">
          We inspect your public repositories, languages,
          activity, and questionable developer decisions.
        </p>

        <div className="mt-10 flex w-full justify-center">
          <GitHubUsernameForm />
        </div>
      </section>
    </main>
  )
}