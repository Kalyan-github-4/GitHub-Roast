import { cn } from "@/lib/utils"
import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react"

interface BrutalistButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost"
  asChild?: boolean
  children: ReactNode
}

export const BrutalistButton = forwardRef<HTMLButtonElement, BrutalistButtonProps>(
  ({ className, variant = "primary", asChild, children, ...props }, ref) => {
    const variantStyles = {
      primary: cn(
        "relative h-12 px-6 border-[2.5px] border-foreground font-bold uppercase tracking-wide",
        "bg-foreground text-background",
        "shadow-[4px_4px_0_0_oklch(0.60_0.22_25)]",
        "transition-all duration-100",
        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_oklch(0.60_0.22_25)]",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0_0_oklch(0.60_0.22_25)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
      ),
      outline: cn(
        "relative h-10 px-4 border-[2.5px] border-foreground font-bold uppercase tracking-wide",
        "bg-background text-foreground",
        "shadow-[3px_3px_0_0_var(--foreground)]",
        "transition-all duration-100",
        "hover:bg-foreground hover:text-background",
        "hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--foreground)]",
        "active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
      ),
      ghost: cn(
        "relative h-10 px-4 font-bold uppercase tracking-wide border-2 border-transparent",
        "text-muted-foreground",
        "hover:border-foreground hover:text-foreground hover:bg-muted",
        "transition-all duration-100"
      ),
    }

    // When asChild is true, render as anchor wrapper
    if (asChild) {
      return (
        <span className={cn(variantStyles[variant], "inline-flex items-center justify-center cursor-pointer", className)}>
          {children}
        </span>
      )
    }

    return (
      <button
        ref={ref}
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

BrutalistButton.displayName = "BrutalistButton"