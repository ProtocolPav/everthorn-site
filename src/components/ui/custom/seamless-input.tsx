// components/ui/seamless-input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface SeamlessInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    as?: "input"
}

interface SeamlessTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    as: "textarea"
}

type SeamlessProps = SeamlessInputProps | SeamlessTextareaProps

export const SeamlessInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, SeamlessProps>(
    ({ className, as = "input", ...props }, ref) => {
        const commonClasses = cn(
            "px-0 border-transparent bg-transparent shadow-none transition-colors",
            "hover:bg-muted/50 hover:px-2 rounded-md",
            "focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring focus-visible:px-2 focus-visible:border-input",
            "placeholder:text-muted-foreground/50",
            className
        )

        if (as === "textarea") {
            return (
                <Textarea
                    ref={ref as React.Ref<HTMLTextAreaElement>}
                    className={cn(commonClasses, "min-h-[auto] resize-none")}
                    {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>}
                />
            )
        }

        return (
            <Input
                ref={ref as React.Ref<HTMLInputElement>}
                className={cn(commonClasses, "h-auto py-1")}
                {...props as React.InputHTMLAttributes<HTMLInputElement>}
            />
        )
    }
)
SeamlessInput.displayName = "SeamlessInput"
