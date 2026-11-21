import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
                destructive:
                    "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
                outline:
                    "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
                attention: "text-purple-900 bg-purple-200 dark:text-purple-100 dark:bg-purple-900",
                command: "bg-muted font-mono",

                // Special Variants
                glass: "border-white/40 bg-white/20 backdrop-blur-md text-foreground dark:border-white/10 dark:bg-white/10",
                soft: "border-transparent bg-primary/10 text-primary hover:bg-primary/20",

                // Full Color Spectrum
                amber: "bg-orange-50 border-orange-300 dark:bg-orange-950/20 dark:border-orange-800 text-yellow-800 dark:text-yellow-400",
                info: "bg-blue-50 border-blue-300 dark:bg-blue-950/20 dark:border-blue-800 text-blue-800 dark:text-blue-400",
                red: "bg-red-50 border-red-300 dark:bg-red-950/20 dark:border-red-800 text-rose-800 dark:text-rose-400",
                green: "bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-800 text-green-800 dark:text-green-400",
                purple: "bg-purple-50 border-purple-300 dark:bg-purple-950/20 dark:border-purple-800 text-purple-800 dark:text-purple-400",
                pink: "bg-pink-50 border-pink-300 dark:bg-pink-950/20 dark:border-pink-800 text-pink-800 dark:text-pink-400",
                indigo: "bg-indigo-50 border-indigo-300 dark:bg-indigo-950/20 dark:border-indigo-800 text-indigo-800 dark:text-indigo-400",
                cyan: "bg-cyan-50 border-cyan-300 dark:bg-cyan-950/20 dark:border-cyan-800 text-cyan-800 dark:text-cyan-400",
                emerald: "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800 text-emerald-800 dark:text-emerald-400",
                slate: "bg-slate-50 border-slate-300 dark:bg-slate-950/20 dark:border-slate-800 text-slate-800 dark:text-slate-400",

                // New Added Colors
                lime: "bg-lime-50 border-lime-300 dark:bg-lime-950/20 dark:border-lime-800 text-lime-800 dark:text-lime-400",
                teal: "bg-teal-50 border-teal-300 dark:bg-teal-950/20 dark:border-teal-800 text-teal-800 dark:text-teal-400",
                sky: "bg-sky-50 border-sky-300 dark:bg-sky-950/20 dark:border-sky-800 text-sky-800 dark:text-sky-400",
                violet: "bg-violet-50 border-violet-300 dark:bg-violet-950/20 dark:border-violet-800 text-violet-800 dark:text-violet-400",
                fuchsia: "bg-fuchsia-50 border-fuchsia-300 dark:bg-fuchsia-950/20 dark:border-fuchsia-800 text-fuchsia-800 dark:text-fuchsia-400",
                rose: "bg-rose-50 border-rose-300 dark:bg-rose-950/20 dark:border-rose-800 text-rose-800 dark:text-rose-400",
                neutral: "bg-neutral-50 border-neutral-300 dark:bg-neutral-950/20 dark:border-neutral-800 text-neutral-800 dark:text-neutral-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
