# GitHub Roast 🔥

GitHub Roast turns any public GitHub profile into a brutally honest developer review.

Enter a GitHub username, and the app analyzes public profile data such as repositories, activity, languages, coding consistency, commit habits, and overall developer behaviour. It then generates a personalized roast based on the actual GitHub profile.

No random insults. Your own GitHub history provides the material.

> Your code may compile. Your GitHub profile may not survive.

## How It Works

```text
GitHub Username
      ↓
GitHub API
      ↓
Profile Data Analysis
      ↓
AI-Generated Roast
      ↓
Developer Score and Insights
```

The application:

1. Fetches public GitHub profile and repository data.
2. Extracts useful developer statistics and coding patterns.
3. Sends the analyzed data to an AI model.
4. Generates a funny, personalized GitHub roast.
5. Displays the roast, scores, and profile insights.

## Tech Stack

* **Next.js** — frontend and backend API routes
* **TypeScript** — type-safe development
* **React** — user interface
* **Tailwind CSS** — styling
* **shadcn/ui** — reusable UI components
* **GitHub REST API** — public profile and repository data
* **AI API** — personalized roast generation
* **Vercel** — deployment

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Kalyan-github-4/GitHub-Roast.git
```

### 2. Open the project

```bash
cd GitHub-Roast
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the environment file

Create a `.env.local` file in the project root:

```env
GITHUB_TOKEN=your_github_personal_access_token
AI_API_KEY=your_ai_api_key
```

Use the exact environment variable names expected inside your project API route.

A GitHub token is recommended because unauthenticated GitHub API requests have lower rate limits.

### 5. Start the development server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Available Commands

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production build locally:

```bash
npm run start
```

Run code checks:

```bash
npm run lint
```

## Production Build

Before deployment, verify that the application builds successfully:

```bash
npm run build
```

Then test the production version locally:

```bash
npm run start
```

## Deployment

The project can be deployed directly to Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the required environment variables.
4. Keep the framework preset set to **Next.js**.
5. Leave the output directory empty or set it to the Next.js default.
6. Deploy the project.

Vercel will automatically run:

```bash
npm run build
```

## Privacy

GitHub Roast only analyzes publicly available GitHub information. It does not require access to private repositories.

The project is built for entertainment and developer feedback. Roasts focus on coding activity and GitHub habits rather than personal characteristics.

## License

MIT © Kalyan Manna

---

Built for developers who are brave enough to submit their GitHub username.
