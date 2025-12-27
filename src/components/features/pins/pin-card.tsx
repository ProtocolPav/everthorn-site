// @/components/features/pins/pin-card.tsx
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { usePin } from '@/hooks/use-pin'
import {
    MapPinIcon,
    CopyIcon,
    CheckIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { PinTypeBadge } from './pin-type-badge'
import { useState } from 'react'
import { ButtonGroup } from "@/components/ui/button-group.tsx"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx"
import { Pin } from "@/types/pins"

interface PinCardProps {
    pin?: Pin
    pinId?: string
    className?: string
}

export function PinCard({ pin, pinId, className }: PinCardProps) {
    const { data: fetchedPin, isLoading, error } = usePin(pinId)
    const [copied, setCopied] = useState(false)

    // Use provided pin or fetched pin
    const pinData = pin || fetchedPin

    const handleCopyCoordinates = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent card click
        if (!pinData) return

        const coords = `${pinData.coordinates[0]} ${pinData.coordinates[1]} ${pinData.coordinates[2]}`
        navigator.clipboard.writeText(coords).then()
        toast.success(`Copied ${coords} to clipboard`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (isLoading) {
        return (
            <Card className={cn("overflow-hidden p-0", className)}>
                <Skeleton className="aspect-video w-sm" />
            </Card>
        )
    }

    if (error || !pinData) {
        return (
            <Empty className={cn("border border-dashed aspect-video overflow-hidden p-0 w-sm", className)}>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <MapPinIcon />
                    </EmptyMedia>
                    <EmptyTitle>Pin Not Found</EmptyTitle>
                    <EmptyDescription>
                        Something went wrong with fetching this pin.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <Card className={cn("min-w-[20rem] w-sm group overflow-hidden transition-colors hover:border-secondary-foreground/25 cursor-pointer p-0", className)}>
            <div className="relative aspect-video overflow-hidden bg-black">
                {/* Image */}
                <img
                    src="/landing/spawn.png"
                    alt={pinData.name}
                    className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-170 ease-out"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 dark:from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Type badge - top right */}
                <div className="absolute top-2.5 right-2.5">
                    <PinTypeBadge type={pinData.pin_type} />
                </div>

                {/* Content overlay - bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5 grid gap-1">
                    {/* Title */}
                    <h3 className="text-base md:text-lg font-semibold leading-tight text-white line-clamp-1">
                        {pinData.name}
                    </h3>

                    {/* Description */}
                    <p className="!m-0 text-[11px] md:text-xs text-white/85 line-clamp-2 leading-relaxed">
                        {pinData.description}
                    </p>

                    {/* Meta footer */}
                    <div className="flex items-center justify-end">
                        {/* Coordinates button group */}
                        <ButtonGroup>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-[10px] md:text-xs px-2 gap-1.5 text-white/90 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30"
                                onClick={handleCopyCoordinates}
                            >
                                <span className="font-mono tabular-nums">
                                    {pinData.coordinates[0]}, {pinData.coordinates[2]}
                                </span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-[10px] md:text-xs px-2 text-white/90 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30"
                                onClick={handleCopyCoordinates}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {copied ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 180 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                        >
                                            <CheckIcon className="size-3.5" weight="bold" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="copy"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0, rotate: 180 }}
                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                        >
                                            <CopyIcon className="size-3.5" weight="bold" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        </Card>
    )
}
