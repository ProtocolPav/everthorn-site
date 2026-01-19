// @/components/features/quests/quest-type-badge.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface QuestTypeBadgeProps {
    type: string,
    className?: string
}

type Variants = 'neutral' | 'violet' | 'sky'

const typeConfig: { [k in string]: {variant: Variants, label: string} } = {
    minor: {
        variant: 'neutral' as const,
        label: 'Minor Quest',
    },
    story: {
        variant: 'violet' as const,
        label: 'Story Quest',
    },
    side: {
        variant: 'sky' as const,
        label: 'Side Quest',
    },
    weekly: {
        variant: 'sky' as const,
        label: 'Weekly Quest',
    },
}

export function QuestTypeBadge({ type, className }: QuestTypeBadgeProps) {
    const config = typeConfig[type]

    return (
        <Badge
            variant={config.variant}
            className={cn(
                "backdrop-blur-md bg-background/95 shadow-xl text-[10px] px-1.5 py-0.5 font-semibold tracking-wide gap-1",
                className
            )}
        >
            {config.label}
        </Badge>
    )
}
