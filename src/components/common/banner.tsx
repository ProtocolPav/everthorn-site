// src/components/ui/banner.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { XIcon } from '@phosphor-icons/react'

const bannerVariants = {
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-b border-blue-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-b border-amber-500/20',
    default: 'bg-muted text-muted-foreground border-b',
} as const

interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: keyof typeof bannerVariants
    onDismiss?: () => void
}

export function Banner({
                           variant = 'default',
                           onDismiss,
                           className,
                           children,
                           ...props
                       }: BannerProps) {
    return (
        <div
            role="banner"
            className={cn(
                'flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium',
                bannerVariants[variant],
                className,
            )}
            {...props}
        >
            <div className="flex-1 text-center">{children}</div>
            {onDismiss && (
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-5 shrink-0 hover:bg-transparent hover:opacity-70"
                    onClick={onDismiss}
                >
                    <XIcon className="size-3.5" />
                </Button>
            )}
        </div>
    )
}