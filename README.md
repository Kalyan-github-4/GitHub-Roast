# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

<<<<<<< HEAD
---

## ✨ Features

- **One-input experience** — type a username, get roasted. No login, no friction.
- **AI roast engine** — analyzes real profile signals (repo count vs. stars, fork-to-original ratio, commit message quality, abandoned projects, "config-file languages" like JSON dominating the language chart) and turns them into targeted jokes, not generic insults.
- **Roast levels** — choose your pain: `Mild 🌶️`, `Medium 🌶️🌶️`, or `No Mercy 🌶️🌶️🌶️`.
- **Stat highlights card** — the funniest findings (longest-dead repo, most over-engineered README, streak graph shaped like a heart monitor flatline) rendered as a shareable image.
- **Share to X / LinkedIn / WhatsApp** — one-tap share with an OG image generated per roast.
- **Compliment mode (hidden)** — for when the roast hits too close to home.

## 🖼️ Preview

<!-- Add a demo GIF here -->
![GitRoast demo](./docs/demo.gif)

## 🧠 How It Works

```
Username → GitHub REST API → Profile signal extraction → LLM prompt → Roast
```

1. **Fetch** — public data via the GitHub REST API: profile, repos, languages, recent events. No OAuth needed for public roasting.
2. **Extract signals** — a scoring layer computes roast-worthy facts: stale repos, tutorial-clone detection ("todo-app", "netflix-clone"…), commit message entropy ("fix" × 47), star-to-repo ratio, README quality.
3. **Roast generation** — signals are passed to the LLM with a persona prompt (stand-up comedian who reviews code). The model roasts *facts*, so every joke is verifiable — that's what makes it land.
4. **Render & share** — roast + stat card rendered client-side; OG image generated server-side for link previews.

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Data | GitHub REST API (unauthenticated + token fallback for rate limits) |
| AI | LLM API (Gemini / Claude) with a structured roast prompt |
| OG Images | `@vercel/og` (or `satori` + `resvg`) |
| Deploy | Vercel (client) + Render / DigitalOcean (API) |

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20
- A GitHub personal access token (optional, but raises API rate limits from 60 → 5,000 req/hr)
- An LLM API key

### Setup
=======
To add components to your app, run the following command:
>>>>>>> 02bdf57 (docs: update project documentation and contribution guidelines)

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
<<<<<<< HEAD

```bash
# Run both client + server
npm run dev
```

Client runs on `http://localhost:5173`, API on `http://localhost:3001`.

## 📁 Project Structure

```
gitroast/
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # RoastCard, StatHighlights, ShareBar, LevelPicker
│   │   ├── hooks/        # useRoast, useGithubProfile
│   │   └── pages/
├── server/               # Express API
│   ├── src/
│   │   ├── routes/       # POST /api/roast
│   │   ├── services/     # github.ts (fetch), signals.ts (extract), roast.ts (LLM)
│   │   └── prompts/      # roast persona + level templates
└── shared/               # Shared types (RoastSignals, RoastResponse)
```

## 🔌 API

### `POST /api/roast`

```json
{
  "username": "Kalyan-github-4",
  "level": "medium"
}
```

**Response:**

```json
{
  "roast": "47 repos, 3 stars. That's not a portfolio, that's a graveyard with good SEO...",
  "highlights": [
    { "label": "Longest abandoned repo", "value": "todo-app-final-v2 (14 months)" },
    { "label": "Top language", "value": "JSON (config files count, right?)" }
  ],
  "shareUrl": "https://gitroast.app/r/abc123"
}
```

## ⚖️ Notes on Ethics & Rate Limits

- Only **public** GitHub data is used. Nothing is stored beyond the generated roast (for share links).
- Roasts target *coding habits*, never the person — the prompt explicitly bans anything personal, identity-based, or genuinely mean.
- GitHub API responses are cached (15 min) to stay well within rate limits.

## 🗺️ Roadmap

- [ ] Roast battles — compare two usernames head-to-head
- [ ] "Roast my repo" — deep-dive roast of a single repository's code
- [ ] Voice roast via TTS (ElevenLabs)
- [ ] Weekly leaderboard of most-roasted profiles (opt-in)

## 🤝 Contributing

PRs welcome! Open an issue first for feature ideas. Please keep new roast templates funny, not cruel — see `server/src/prompts/GUIDELINES.md`.

## 📄 License

MIT © [Kalyan Manna](https://github.com/Kalyan-github-4)

---

*Built for fun. If the roast hurt, remember: `git commit -m "fix"` was your choice.*
=======
>>>>>>> 02bdf57 (docs: update project documentation and contribution guidelines)
