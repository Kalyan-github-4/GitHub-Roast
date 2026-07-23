import { GitHubUsernameForm } from "@/components/GitHubUsernameForm"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-20 text-foreground">
      {/* Dot grid background decoration */}
      <div className="pointer-events-none absolute inset-0 dot-grid" aria-hidden />

      {/* Decorative corner scribbles */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 text-5xl opacity-20 wiggle select-none"
      >
        🔥
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute right-4 top-4 text-5xl opacity-20 wiggle select-none"
        style={{ animationDelay: "0.8s" }}
      >
        💀
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 left-8 text-4xl opacity-15 wiggle select-none"
        style={{ animationDelay: "1.3s" }}
      >
        🤡
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-8 right-8 text-4xl opacity-15 wiggle select-none"
        style={{ animationDelay: "0.4s" }}
      >
        ☕
      </span>

      <section className="relative mx-auto flex max-w-5xl flex-col items-center slide-up">
        {/* Stamp badge */}
        <div
          className="stamp wiggle"
          aria-label="Warning badge"
        >
          ⚠️ Your commits are about to be judged
        </div>

        {/* Main heading */}
        <h1
          className="mt-8 max-w-3xl text-center font-heading leading-[1.05] tracking-tight"
          style={{ fontSize: "clamp(2.4rem, 7vw, 5rem)", fontWeight: 800 }}
        >
          <span className="block marker-yellow px-2">Roast your</span>
          <span className="block relative">
            GitHub profile
            {/* Hand-drawn underline feel */}
            <svg
              aria-hidden
              className="absolute -bottom-2 left-0 w-full overflow-visible"
              height="10"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M2 7 Q25 2 50 7 Q75 12 98 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Sub-description */}
        <p className="mt-8 max-w-xl text-center text-base font-medium leading-7 text-muted-foreground sm:text-lg">
          We dig through your public repos, commit messages, and{" "}
          <span className="squiggle font-bold text-foreground">questionable developer decisions</span>
          {" "}— then we roast you. Lovingly. Mostly.
        </p>

        {/* Humanized trust signals row */}
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-bold text-muted-foreground">
          <span>✅ 100% real data</span>
          <span className="opacity-40">·</span>
          <span>😬 0% mercy</span>
          <span className="opacity-40">·</span>
          <span>🤐 No AI fluff</span>
        </div>

        {/* Form */}
        <div className="mt-12 flex w-full justify-center">
          <GitHubUsernameForm />
        </div>
      </section>
    </main>
  )
}