// @/components/features/pins/pin-type-badge.tsx
import { Badge } from '@/components/ui/badge'
import { StorefrontIcon, TreeIcon, MapPinIcon, PushPinIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface PinTypeBadgeProps {
    type: string
    className?: string
}

const styles: Record<string, { variant: any, icon: any, label?: string }> = {
    shop:  { variant: 'cyan',  icon: StorefrontIcon },
    relic: { variant: 'amber', icon: MapPinIcon, label: 'Landmark' },
    farm:  { variant: 'pink',  icon: TreeIcon },
}

export function PinTypeBadge({ type, className }: PinTypeBadgeProps) {
    const style = styles[type.toLowerCase()] || { variant: 'secondary', icon: PushPinIcon }
    const Icon = style.icon

    return (
        <Badge
            variant={style.variant}
            className={cn("backdrop-blur-md bg-background/95 shadow-xl text-[10px] px-2.5 py-0.5 font-semibold tracking-wide gap-1", className)}
        >
            <Icon weight="fill" />
            <span className="capitalize">{style.label || type}</span>
        </Badge>
    )
}
