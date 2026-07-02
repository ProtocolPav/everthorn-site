import * as PhosphorIcons from '@phosphor-icons/react'
import type { Icon, IconWeight } from '@phosphor-icons/react'

type IconName = keyof typeof PhosphorIcons

const FALLBACK_ICON_NAME: IconName = 'QuestionIcon'

interface IconResolverProps {
    name: string
    className?: string
    weight?: IconWeight
    size?: number
}

export function resolveIcon(name: string): Icon {
    const resolved = PhosphorIcons[name as IconName]
    if (resolved) {
        return resolved as Icon
    }
    return PhosphorIcons[FALLBACK_ICON_NAME] as Icon
}

export function IconResolver({ name, className, weight = 'duotone', size }: IconResolverProps) {
    const ResolvedIcon = resolveIcon(name)
    return <ResolvedIcon className={className} weight={weight} size={size} />
}