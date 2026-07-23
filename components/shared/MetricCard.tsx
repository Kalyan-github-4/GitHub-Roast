import { cn } from "@/lib/utils"

interface MetricCardProps {
  label: string
  value: string | number
  emoji?: string
  className?: string
}

export function MetricCard({ label, value, emoji, className }: MetricCardProps) {
  return (
    <article
      className={cn(
        "border-[2.5px] border-foreground bg-background p-4 transition-all duration-100",
        "hover:translate-x-[2px] hover:translate-y-[2px]",
        "brutal-shadow hover:shadow-none",
        className
      )}
    >
      {emoji && (
        <span className="text-xl" aria-hidden>
          {emoji}
        </span>
      )}
      <p className="mt-1 text-3xl font-heading font-extrabold">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </article>
  )
}