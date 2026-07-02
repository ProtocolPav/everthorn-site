import type { DividerBlock as DividerBlockType } from '@/api/nexuscore/model'
import { cn } from '@/lib/utils'

interface DividerBlockProps {
    block: DividerBlockType
}

export function DividerBlock({ block }: DividerBlockProps) {
    const style = block.style ?? 'line'

    if (style === 'spacer') {
        return <div className="py-6 md:py-10" />
    }

    return (
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-4">
            {style === 'line' && (
                <hr className="border-border" />
            )}
            {style === 'dots' && (
                <div className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>
            )}
            {style === 'gradient' && (
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            )}
            {style === 'fade' && (
                <div className={cn('h-px bg-gradient-to-r from-border to-transparent')} />
            )}
        </div>
    )
}
