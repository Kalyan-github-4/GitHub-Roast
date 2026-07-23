import { cn } from "@/lib/utils"
import { forwardRef, InputHTMLAttributes } from "react"

export const BrutalistInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 border-[2.5px] border-foreground bg-background px-4",
        "font-mono font-medium placeholder:text-muted-foreground",
        "transition-all duration-100",
        "shadow-[4px_4px_0_0_var(--foreground)]",
        "focus:outline-none focus:shadow-[2px_2px_0_0_var(--foreground)] focus:translate-x-[2px] focus:translate-y-[2px]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "rounded-none",
        className
      )}
      {...props}
    />
  )
})

BrutalistInput.displayName = "BrutalistInput"