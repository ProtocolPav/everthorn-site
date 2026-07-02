import { useState, useEffect } from 'react'
import { HourglassIcon, CalendarIcon } from '@phosphor-icons/react'
import type { CountdownBlock as CountdownBlockType } from '@/api/nexuscore/model'
import { cn } from '@/lib/utils'

interface CountdownBlockProps {
    block: CountdownBlockType
}

function getTimeLeft(targetIso: string) {
    const diff = new Date(targetIso).getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true }
    return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        finished: false,
    }
}

export function CountdownBlock({ block }: CountdownBlockProps) {
    const [time, setTime] = useState(() => getTimeLeft(block.target_time))

    useEffect(() => {
        const id = setInterval(() => setTime(getTimeLeft(block.target_time)), 1000)
        return () => clearInterval(id)
    }, [block.target_time])

    const units = [
        { label: 'Days', value: time.days },
        { label: 'Hours', value: time.hours },
        { label: 'Minutes', value: time.minutes },
        { label: 'Seconds', value: time.seconds },
    ]

    return (
        <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
                <div className="text-center mb-8">
                    {block.label && (
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <HourglassIcon className="w-5 h-5 text-primary" weight="duotone" />
                            <p className="text-sm font-semibold uppercase tracking-widest text-primary">{block.label}</p>
                        </div>
                    )}
                    {block.title && (
                        <h2 className="text-2xl md:text-3xl font-bold">{block.title}</h2>
                    )}
                </div>

                {time.finished ? (
                    <div className="text-center py-6">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <CalendarIcon className="w-5 h-5" weight="duotone" />
                            <span className="text-lg font-semibold">{block.finished_message ?? 'Event has started!'}</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-3 md:gap-5 max-w-lg mx-auto">
                        {units.map(({ label, value }) => (
                            <div
                                key={label}
                                className={cn(
                                    'flex flex-col items-center justify-center rounded-xl border bg-card p-3 md:p-5',
                                    'shadow-sm'
                                )}
                            >
                                <span className="text-3xl md:text-5xl font-bold tabular-nums leading-none">
                                    {String(value).padStart(2, '0')}
                                </span>
                                <span className="text-xs text-muted-foreground mt-1.5 font-medium uppercase tracking-wide">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
