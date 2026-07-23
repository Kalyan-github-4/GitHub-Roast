import { cn } from "@/lib/utils"

interface ScoreCardProps {
  label: string
  value: number
  variant?: "yellow" | "blue" | "purple" | "red"
  emoji?: string
}

const variantStyles = {
  yellow: "bg-[oklch(0.88_0.15_88)] text-foreground border-foreground",
  blue: "bg-[oklch(0.55_0.18_250)] text-white border-[oklch(0.35_0.15_250)]",
  purple: "bg-[oklch(0.52_0.20_300)] text-white border-[oklch(0.35_0.16_300)]",
  red: "bg-[oklch(0.60_0.22_25)] text-white border-[oklch(0.40_0.18_25)]",
}

const variantShadows = {
  yellow: "shadow-[6px_6px_0_0_oklch(0.60_0.12_80)]",
  blue: "shadow-[6px_6px_0_0_oklch(0.25_0.15_250)]",
  purple: "shadow-[6px_6px_0_0_oklch(0.25_0.16_300)]",
  red: "shadow-[6px_6px_0_0_oklch(0.25_0.15_25)]",
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "🏆 Impressive"
  if (score >= 70) return "✅ Decent"
  if (score >= 50) return "🤔 Meh"
  if (score >= 30) return "😬 Yikes"
  return "💀 RIP"
}

export function ScoreCard({ label, value, variant = "red", emoji }: ScoreCardProps) {
  return (
    <article
      className={cn(
        "border-[2.5px] p-5 transition-all duration-100",
        "hover:translate-x-[2px] hover:translate-y-[2px]",
        variantStyles[variant],
        variantShadows[variant],
        "hover:shadow-none"
      )}
    >
      {emoji && <span className="text-lg" aria-hidden>{emoji}</span>}
      <p className="mt-1 text-xs font-bold uppercase tracking-widest opacity-80">{label}</p>
      <p className="mt-2 font-heading text-5xl font-extrabold leading-none">
        {value}
        <span className="text-lg font-bold opacity-70">/100</span>
      </p>
      <p className="mt-2 text-xs font-bold opacity-75">{getScoreLabel(value)}</p>
    </article>
  )
}