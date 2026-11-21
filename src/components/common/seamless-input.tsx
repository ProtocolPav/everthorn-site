// components/ui/seamless-input.tsx
import * as React from "react"
import { cn } from "@/lib/utils.ts"
import { Textarea } from "@/components/ui/textarea.tsx"

interface SeamlessInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    as?: "input"
}

interface SeamlessTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    as: "textarea"
}

type SeamlessProps = SeamlessInputProps | SeamlessTextareaProps

export const SeamlessInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, SeamlessProps>(
    ({ className, as = "input", ...props }, ref) => {

        // Core logic:
        // 1. transparent background by default
        // 2. consistent padding (px-3 py-2) so text doesn't move
        const commonClasses = cn(
            "w-full bg-transparent border-none shadow-none resize-none transition-all duration-200 ease-in-out",
            "text-foreground placeholder:text-muted-foreground/40",
            "px-3 py-2 rounded-md", // The "Anti-Jump" spacing
            "hover:bg-accent/50", // Subtle hover state
            "focus-visible:bg-accent/30 focus-visible:ring-0 focus-visible:outline-none", // Clean focus state without jarring blue rings
            className
        )

        if (as === "textarea") {
            return (
                <Textarea
                    ref={ref as React.Ref<HTMLTextAreaElement>}
                    className={cn(commonClasses, "min-h-auto overflow-hidden field-sizing-content px-2.5")}
                    {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
                />
            )
        }

        return (
            <input
                ref={ref as React.Ref<HTMLInputElement>}
                className={cn(commonClasses, "h-auto truncate px-1.5")}
                {...props as React.InputHTMLAttributes<HTMLInputElement>}
            />
        )
    }
)
SeamlessInput.displayName = "SeamlessInput"
