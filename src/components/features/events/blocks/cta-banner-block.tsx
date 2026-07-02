import type { CtaBannerBlock as CtaBannerBlockType } from '@/api/nexuscore/model'
import { Button } from '@/components/ui/button'
import { IconResolver } from '../icon-resolver'
import { cn } from '@/lib/utils'

interface CtaBannerBlockProps {
    block: CtaBannerBlockType
}

export function CtaBannerBlock({ block }: CtaBannerBlockProps) {
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
                    <div className="relative z-10 text-center">
                        <h2 className="text-2xl md:text-4xl font-bold mb-3">{block.heading}</h2>
                        {block.description && (
                            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-7">
                                {block.description}
                            </p>
                        )}
                        {block.buttons && block.buttons.length > 0 && (
                            <div className="flex flex-wrap gap-3 justify-center">
                                {block.buttons.map((btn, i) => (
                                    <Button
                                        key={i}
                                        variant={btn.variant === 'primary' ? 'default' : 'outline'}
                                        size="lg"
                                        asChild
                                    >
                                        <a href={btn.url} target="_blank" rel="noopener noreferrer">
                                            {btn.icon && (
                                                <IconResolver name={btn.icon} className="mr-2 w-4 h-4" weight="bold" />
                                            )}
                                            {btn.label}
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