import type { CtaBannerBlock as CtaBannerBlockType } from '@/api/nexuscore/model'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface CtaBannerBlockProps {
    block: CtaBannerBlockType
}

export function CtaBannerBlock({ block }: CtaBannerBlockProps) {
    const align = block.alignment ?? 'center'
    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                <div
                    className={cn(
                        'relative overflow-hidden rounded-2xl border p-8 md:p-12',
                        'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent'
                    )}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
                    <div
                        className={cn(
                            'relative z-10',
                            align === 'center' && 'text-center',
                            align === 'left' && 'text-left',
                            align === 'right' && 'text-right'
                        )}
                    >
                        {block.eyebrow && (
                            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                                {block.eyebrow}
                            </p>
                        )}
                        <h2 className="text-2xl md:text-4xl font-bold mb-3">{block.heading}</h2>
                        {block.body && (
                            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-7">
                                {block.body}
                            </p>
                        )}
                        {block.buttons && block.buttons.length > 0 && (
                            <div
                                className={cn(
                                    'flex flex-wrap gap-3',
                                    align === 'center' && 'justify-center',
                                    align === 'left' && 'justify-start',
                                    align === 'right' && 'justify-end'
                                )}
                            >
                                {block.buttons.map((btn, i) => (
                                    <Button
                                        key={i}
                                        variant={i === 0 ? 'default' : 'outline'}
                                        size="lg"
                                        asChild
                                    >
                                        <a href={btn.url} target="_blank" rel="noopener noreferrer">
                                            {btn.label}
                                            {i === 0 && (
                                                <ArrowRightIcon className="ml-2 w-4 h-4" weight="bold" />
                                            )}
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
