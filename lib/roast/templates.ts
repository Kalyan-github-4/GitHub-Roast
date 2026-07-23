export type RoastSeverity = "mild" | "spicy" | "brutal"

export type RoastCategory =
  | "documentation"
  | "commits"
  | "repositories"
  | "languages"
  | "popularity"
  | "general"

export type RoastContext = {
  username: string
  totalRepos: number
  totalStars: number
  originalRepos: number
  forkedRepos: number
  missingDescriptions: number
  missingReadmes: number
  missingLicenses: number
  staleRepos: number
  genericCommitRatio: number
  conventionalCommitRatio: number
  suspiciousMessages: string[]
  topLanguage?: string
  overallScore: number
}

export type RoastTemplate = {
  id: string
  category: RoastCategory
  severity: RoastSeverity
  condition: (context: RoastContext) => boolean
  message: (context: RoastContext) => string
}

export const roastTemplates: RoastTemplate[] = [
  // ── DOCUMENTATION ──────────────────────────────────────────────────────────
  {
    id: "missing-readmes-high",
    category: "documentation",
    severity: "brutal",
    condition: (ctx) => ctx.missingReadmes >= 5,
    message: (ctx) =>
      `${ctx.missingReadmes} repos with no README. Not even a "hello world" in a text file. Your future self is going to open these and feel like an archaeologist who just got cursed.`,
  },
  {
    id: "missing-readmes-medium",
    category: "documentation",
    severity: "spicy",
    condition: (ctx) => ctx.missingReadmes >= 2 && ctx.missingReadmes < 5,
    message: (ctx) =>
      `${ctx.missingReadmes} repos are just vibes with no README. Cool mystery project bro. Very "figure it out yourself" energy. Very not helpful.`,
  },
  {
    id: "missing-readmes-low",
    category: "documentation",
    severity: "mild",
    condition: (ctx) => ctx.missingReadmes === 1,
    message: () =>
      `One lonely README-less repo sitting there like "please don't look at me." Don't worry, we looked.`,
  },
  {
    id: "missing-descriptions",
    category: "documentation",
    severity: "spicy",
    condition: (ctx) => ctx.missingDescriptions >= 4,
    message: (ctx) =>
      `${ctx.missingDescriptions} repos with literally no description. You could write anything — "idk vibes", "don't ask", "half-finished masterpiece" — and it'd be better than nothing. You chose nothing.`,
  },
  {
    id: "missing-licenses",
    category: "documentation",
    severity: "mild",
    condition: (ctx) => ctx.missingLicenses >= 4,
    message: (ctx) =>
      `${ctx.missingLicenses} projects have no license. Legally speaking, nobody can use your code. Practically speaking, nobody was going to anyway, but still. The principle!`,
  },
  {
    id: "missing-licenses-high",
    category: "documentation",
    severity: "spicy",
    condition: (ctx) => ctx.missingLicenses >= 8,
    message: (ctx) =>
      `${ctx.missingLicenses} repos with no license. That's not open source, that's just vibes. A lawyer somewhere is very confused about what you even own at this point.`,
  },

  // ── COMMITS ─────────────────────────────────────────────────────────────────
  {
    id: "generic-commits-high",
    category: "commits",
    severity: "brutal",
    condition: (ctx) => ctx.genericCommitRatio >= 0.35,
    message: (ctx) =>
      `${Math.round(ctx.genericCommitRatio * 100)}% generic commit messages. "fix", "update", "stuff", "asdf" — honestly at this point just commit with "🙃" and save us all the pretense.`,
  },
  {
    id: "generic-commits-medium",
    category: "commits",
    severity: "spicy",
    condition: (ctx) => ctx.genericCommitRatio >= 0.15 && ctx.genericCommitRatio < 0.35,
    message: (ctx) =>
      `${Math.round(ctx.genericCommitRatio * 100)}% of your commits say basically nothing. "Update file." Which file? What update? You're writing for git history, not ghosting your ex.`,
  },
  {
    id: "suspicious-message-fix",
    category: "commits",
    severity: "brutal",
    condition: (ctx) => ctx.suspiciousMessages.some(m => m.toLowerCase().includes("fix")),
    message: (ctx) => {
      const fixMsg = ctx.suspiciousMessages.find(m => m.toLowerCase().includes("fix"))
      return `You committed "${fixMsg}". Somewhere a tech lead read that and quietly updated their resume.`
    },
  },
  {
    id: "suspicious-message-generic",
    category: "commits",
    severity: "brutal",
    condition: (ctx) => ctx.suspiciousMessages.length > 0,
    message: (ctx) =>
      `We found "${ctx.suspiciousMessages[0]}" in your commit history. That commit message is less informative than a shrug emoji. Please, we're begging you.`,
  },
  {
    id: "suspicious-messages-multiple",
    category: "commits",
    severity: "brutal",
    condition: (ctx) => ctx.suspiciousMessages.length >= 3,
    message: (ctx) =>
      `Your commit hall of shame includes: "${ctx.suspiciousMessages.slice(0, 3).join('", "')}". This is less of a version history and more of a cry for help.`,
  },
  {
    id: "good-conventional-commits",
    category: "commits",
    severity: "mild",
    condition: (ctx) => ctx.conventionalCommitRatio >= 0.6,
    message: () =>
      `Your commits are suspiciously well-formatted. feat:, fix:, chore: — very professional. Very "I've been burned by bad commit history before and I will not let that happen again." We respect the trauma.`,
  },
  {
    id: "perfect-conventional-commits",
    category: "commits",
    severity: "mild",
    condition: (ctx) => ctx.conventionalCommitRatio >= 0.85,
    message: () =>
      `Conventional commits at 85%+. You absolute nerd. You actually read the spec, didn't you? Who hurt you into becoming this disciplined?`,
  },

  // ── REPOSITORIES ────────────────────────────────────────────────────────────
  {
    id: "many-forks",
    category: "repositories",
    severity: "spicy",
    condition: (ctx) => ctx.totalRepos > 0 && ctx.forkedRepos / ctx.totalRepos >= 0.5,
    message: (ctx) =>
      `${ctx.forkedRepos} of your repos are forks. Your GitHub is basically a Pinterest board for other people's work. "Bookmarking but make it code."`,
  },
  {
    id: "many-forks-extreme",
    category: "repositories",
    severity: "brutal",
    condition: (ctx) => ctx.totalRepos > 0 && ctx.forkedRepos / ctx.totalRepos >= 0.75,
    message: (ctx) =>
      `${ctx.forkedRepos} forks out of ${ctx.totalRepos} total repos. At this point just curate a list. GitHub isn't a streaming service — you can't binge-fork and call it contributions.`,
  },
  {
    id: "many-stale-repos",
    category: "repositories",
    severity: "brutal",
    condition: (ctx) => ctx.staleRepos >= 5,
    message: (ctx) =>
      `${ctx.staleRepos} repos haven't been touched in over a year. They're not abandoned, you're just "letting them breathe." Very avant-garde. Very "my side project is in a long-distance relationship with completion."`,
  },
  {
    id: "some-stale-repos",
    category: "repositories",
    severity: "spicy",
    condition: (ctx) => ctx.staleRepos >= 2 && ctx.staleRepos < 5,
    message: (ctx) =>
      `${ctx.staleRepos} stale repos just sitting there collecting digital dust. It's fine. "I'll come back to it." We've all said it. We never come back to it.`,
  },
  {
    id: "no-original-repos",
    category: "repositories",
    severity: "brutal",
    condition: (ctx) => ctx.originalRepos === 0 && ctx.totalRepos > 0,
    message: () =>
      `Zero original repositories. Your whole GitHub is borrowed. You're the DJ who only plays other people's songs and calls it a set.`,
  },

  // ── POPULARITY ──────────────────────────────────────────────────────────────
  {
    id: "many-repos-zero-stars",
    category: "popularity",
    severity: "brutal",
    condition: (ctx) => ctx.totalRepos >= 10 && ctx.totalStars === 0,
    message: (ctx) =>
      `${ctx.totalRepos} repos. Zero stars. Not even your own alternate account threw you a pity star. The internet has collectively decided to walk past your work like it's a street performer doing mimes.`,
  },
  {
    id: "many-repos-low-stars",
    category: "popularity",
    severity: "spicy",
    condition: (ctx) => ctx.totalRepos >= 15 && ctx.totalStars <= 3,
    message: (ctx) =>
      `${ctx.totalRepos} repos, ${ctx.totalStars} total stars. The ratio is sending. You're out here shipping like a startup with no marketing team and zero customers.`,
  },
  {
    id: "lots-of-stars",
    category: "popularity",
    severity: "mild",
    condition: (ctx) => ctx.totalStars >= 100,
    message: (ctx) =>
      `${ctx.totalStars} stars. Okay, people actually like your stuff. That's embarrassing for us to admit but here we are. Don't let it go to your head — we still found plenty of problems.`,
  },
  {
    id: "viral-star",
    category: "popularity",
    severity: "mild",
    condition: (ctx) => ctx.totalStars >= 1000,
    message: (ctx) =>
      `${ctx.totalStars.toLocaleString()} stars. Fine. You clearly know what you're doing at least once. The other repos are still a mess but this one slaps. We're watching you.`,
  },

  // ── LANGUAGES ───────────────────────────────────────────────────────────────
  {
    id: "typescript-heavy",
    category: "languages",
    severity: "mild",
    condition: (ctx) => ctx.topLanguage === "TypeScript",
    message: () =>
      `TypeScript is your top language. You don't trust JavaScript and JavaScript doesn't trust you back. It's a beautiful, codependent relationship. Therapy won't fix it but type safety might.`,
  },
  {
    id: "javascript-heavy",
    category: "languages",
    severity: "spicy",
    condition: (ctx) => ctx.topLanguage === "JavaScript",
    message: () =>
      `JavaScript is your top language. Living on the edge with no types, no rules, just vibes and runtime errors. Respect the chaos. Also please add TypeScript.`,
  },
  {
    id: "python-heavy",
    category: "languages",
    severity: "mild",
    condition: (ctx) => ctx.topLanguage === "Python",
    message: () =>
      `Python dev spotted. Your code reads like English, which means it's either elegant or hiding 47 import issues behind a beautiful facade of indentation.`,
  },
  {
    id: "rust-heavy",
    category: "languages",
    severity: "mild",
    condition: (ctx) => ctx.topLanguage === "Rust",
    message: () =>
      `Rust main character. You spent 3 weeks fighting the borrow checker and now you're legally required to mention it every 10 minutes. We get it. Memory safety. Very cool. Please talk about something else.`,
  },
  {
    id: "php-heavy",
    category: "languages",
    severity: "brutal",
    condition: (ctx) => ctx.topLanguage === "PHP",
    message: () =>
      `PHP is your top language. Look, we respect the hustle. PHP powers half the internet. But also you're choosing to write PHP in ${new Date().getFullYear()} and that says something about your relationship with pain.`,
  },
  {
    id: "css-heavy",
    category: "languages",
    severity: "mild",
    condition: (ctx) => ctx.topLanguage === "CSS",
    message: () =>
      `CSS is your top language. You understand things most devs are afraid of. You've centered a div and you've survived. Respect. Also your margin: auto journey clearly has been a spiritual one.`,
  },
  {
    id: "shell-heavy",
    category: "languages",
    severity: "spicy",
    condition: (ctx) => ctx.topLanguage === "Shell",
    message: () =>
      `Shell scripts as your top language. You're basically writing hieroglyphics that only work on your machine. Noble. Chaotic. Very "I have strong opinions about bash vs zsh."`,
  },

  // ── GENERAL ─────────────────────────────────────────────────────────────────
  {
    id: "low-score",
    category: "general",
    severity: "brutal",
    condition: (ctx) => ctx.overallScore < 35,
    message: (ctx) =>
      `${ctx.overallScore}/100. We've seen student projects from people who just discovered git that scored higher. This isn't even a portfolio — it's a digital archaeology site for future historians to study what developers were like before they cared.`,
  },
  {
    id: "very-low-score",
    category: "general",
    severity: "brutal",
    condition: (ctx) => ctx.overallScore < 20,
    message: (ctx) =>
      `${ctx.overallScore}/100. This is a historic achievement in the wrong direction. We'd say "at least you're trying" but the commit history suggests you're also not doing that.`,
  },
  {
    id: "medium-score",
    category: "general",
    severity: "spicy",
    condition: (ctx) => ctx.overallScore >= 35 && ctx.overallScore < 65,
    message: (ctx) =>
      `${ctx.overallScore}/100. The "C student of open source." You clearly have potential, it's just buried under seventeen unfinished projects, four repos named "test", and the eternal optimism that you'll document it "later."`,
  },
  {
    id: "decent-score",
    category: "general",
    severity: "spicy",
    condition: (ctx) => ctx.overallScore >= 65 && ctx.overallScore < 80,
    message: (ctx) =>
      `${ctx.overallScore}/100. Not bad. We wanted to destroy you and honestly you've made it difficult. You clearly know what you're doing, which is more than we can say for the commit messages.`,
  },
  {
    id: "good-score",
    category: "general",
    severity: "mild",
    condition: (ctx) => ctx.overallScore >= 80,
    message: (ctx) =>
      `${ctx.overallScore}/100. Annoyingly competent. We had to really squint to find issues. You maintain your repos like someone who's been personally victimized by unmaintained dependencies before. We see you.`,
  },
  {
    id: "invisible-developer",
    category: "general",
    severity: "mild",
    condition: (ctx) => ctx.totalRepos >= 8 && ctx.totalStars <= 2 && ctx.originalRepos >= 3,
    message: (ctx) =>
      `${ctx.originalRepos} original repos and barely any stars. You're the kind of developer who ships things quietly, doesn't announce it, and somehow expects the algorithm to do the work. Respectfully: it won't. Tell people about your projects.`,
  },
]