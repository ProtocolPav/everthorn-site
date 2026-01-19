// @/components/features/quests/quest-status-badge.tsx
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface QuestStatusBadgeProps {
    status: string,
    className?: string
}

type Variants = 'green' | 'amber' | 'red'

const typeConfig: { [k in string]: {variant: Variants, label: string} } = {
    active: {
        variant: 'green' as const,
        label: 'Active',
    },
    scheduled: {
        variant: 'amber' as const,
        label: 'Scheduled',
    },
    expired: {
        variant: 'red' as const,
        label: 'Expired',
    }
}

export function QuestStatusBadge({ status, className }: QuestStatusBadgeProps) {
    const config = typeConfig[status]

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
