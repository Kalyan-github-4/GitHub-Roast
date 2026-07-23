import { cn } from "@/lib/utils"
import { forwardRef, HTMLAttributes } from "react"

interface BrutalistContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent" | "error" | "roast" | "muted"
}

export const BrutalistContainer = forwardRef<
  HTMLDivElement,
  BrutalistContainerProps
>(({ className, variant = "default", children, ...props }, ref) => {
  const variantStyles = {
    default:
      "border-[2.5px] border-foreground bg-card brutal-shadow",
    accent:
      "border-[2.5px] border-foreground brutal-shadow-lg relative overflow-hidden",
    roast:
      "border-[2.5px] border-foreground brutal-shadow-lg relative overflow-hidden",
    error:
      "border-[2.5px] border-foreground bg-[oklch(0.60_0.22_25)] text-white",
    muted:
      "border-[2.5px] border-foreground/40 bg-muted",
  }

  const accentInner =
    variant === "accent"
      ? {
          background:
            "linear-gradient(135deg, oklch(0.60 0.22 25) 0%, oklch(0.52 0.20 20) 100%)",
          color: "white",
        }
      : variant === "roast"
      ? {
          background:
            "linear-gradient(135deg, oklch(0.13 0.02 40) 0%, oklch(0.22 0.04 40) 100%)",
          color: "oklch(0.97 0.015 85)",
        }
      : {}

  return (
    <div
      ref={ref}
      className={cn(variantStyles[variant], className)}
      style={accentInner}
      {...props}
    >
      {children}
    </div>
  )
})

BrutalistContainer.displayName = "BrutalistContainer"