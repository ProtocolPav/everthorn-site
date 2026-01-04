import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
    XCircleIcon,
    FunnelIcon,
    SortAscendingIcon,
    SortDescendingIcon,
    TextAaIcon,
    MagnifyingGlassIcon,
    CheckIcon,
    XIcon,
    ClockCounterClockwiseIcon,
    CheckCircleIcon,
    HandWavingIcon,
    SealQuestionIcon
} from "@phosphor-icons/react"
import { Route } from '@/routes/admin/projects'

export const projectsSearchSchema = z.object({
    query: z.string().optional(),
    status: z.array(z.enum(["pending", "ongoing", "abandoned", "completed"])).optional(),
    sort: z.enum(['newest', 'oldest', 'name']).catch('newest'),
})

// Mapped exactly to ProjectStatusBadge config
// Note: "pending" was missing in your badge file but exists in schema, so I kept it with a neutral style
const statusConfig = {
    ongoing: {
        label: "In Progress",
        icon: ClockCounterClockwiseIcon,
        // Pink Variant Styles
        activeClass: "bg-pink-500 text-white border-pink-600 hover:bg-pink-600 dark:bg-pink-600 dark:text-white",
        dotClass: "bg-white"
    },
    completed: {
        label: "Completed",
        icon: CheckCircleIcon,
        // Amber Variant Styles
        activeClass: "bg-amber-500 text-white border-amber-600 hover:bg-amber-600 dark:bg-amber-600 dark:text-white",
        dotClass: "bg-white"
    },
    abandoned: {
        label: "Available",
        icon: HandWavingIcon,
        // Cyan Variant Styles
        activeClass: "bg-cyan-500 text-white border-cyan-600 hover:bg-cyan-600 dark:bg-cyan-600 dark:text-white",
        dotClass: "bg-white"
    },
    pending: {
        label: "Pending Approval",
        icon: SealQuestionIcon,
        activeClass: "bg-indigo-500 text-white border-indigo-600 hover:bg-indigo-600 dark:bg-indigo-600 dark:text-white",
        dotClass: "bg-white"
    }
}

const sortOptions = [
    { value: "newest", label: "Newest First", icon: SortDescendingIcon },
    { value: "oldest", label: "Oldest First", icon: SortAscendingIcon },
    { value: "name", label: "Name (A-Z)", icon: TextAaIcon },
]

export function ProjectsFilter() {
    const navigate = useNavigate({ from: Route.fullPath })
    const search = Route.useSearch()
    const [localQuery, setLocalQuery] = useState(search.query || '')

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (localQuery !== search.query) {
                navigate({
                    search: (prev) => ({ ...prev, query: localQuery || undefined }),
                    replace: true,
                })
            }
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [localQuery, navigate, search.query])

    useEffect(() => {
        if (search.query !== localQuery) setLocalQuery(search.query || '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.query])

    const updateFilter = (updates: Partial<typeof search>) => {
        navigate({
            search: (prev) => ({ ...prev, ...updates }),
            replace: true,
        })
    }

    const handleStatusToggle = (status: string) => {
        const current = search.status ? [...search.status] : []
        const statusValue = status as keyof typeof statusConfig

        const newStatus = current.includes(statusValue)
            ? current.filter(s => s !== statusValue)
            : [...current, statusValue]

        updateFilter({ status: newStatus.length > 0 ? newStatus : undefined })
    }

    const activeFilterCount = (search.query ? 1 : 0) + (search.status?.length || 0)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="secondary"
                    size="sm"
                    className={cn(
                        "h-8 gap-2 px-3 text-xs font-medium shadow-sm transition-all hover:bg-secondary/80"
                    )}
                >
                    <FunnelIcon className="h-3.5 w-3.5" weight={activeFilterCount > 0 ? "fill" : "regular"} />
                    <span>Filter</span>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[280px] p-0 shadow-lg border-muted/40" align="end" sideOffset={8}>
                <div className="flex flex-col">

                    {/* Search Input */}
                    <div className="relative border-b px-3 py-2.5">
                        <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-3.5 w-3.5 text-muted-foreground/70" />
                        <input
                            placeholder="Find projects..."
                            className="w-full bg-transparent pl-6 text-xs font-medium outline-none placeholder:text-muted-foreground/50"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                            autoFocus
                        />
                        {localQuery && (
                            <button onClick={() => setLocalQuery('')} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                                <XCircleIcon className="h-3.5 w-3.5" weight="fill" />
                            </button>
                        )}
                    </div>

                    {/* Status Chips */}
                    <div className="p-3">
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                            Status
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {Object.entries(statusConfig).map(([status, config]) => {
                                const isSelected = !!search.status?.includes(status as any)
                                const Icon = config.icon

                                return (
                                    <Badge
                                        key={status}
                                        variant="outline"
                                        onClick={() => handleStatusToggle(status)}
                                        className={cn(
                                            "cursor-pointer px-2.5 py-1 text-[11px] font-medium transition-all duration-200 select-none gap-1.5 border",
                                            isSelected
                                                ? config.activeClass
                                                : "border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                        )}
                                    >
                                        <Icon weight={isSelected ? "fill" : "regular"} className="h-3.5 w-3.5" />
                                        {config.label}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Sort Options */}
                    <div className="p-1.5">
                        {sortOptions.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => updateFilter({ sort: option.value as any })}
                                className={cn(
                                    "flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                                    search.sort === option.value
                                        ? "bg-primary/5 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <option.icon className={cn("h-3.5 w-3.5", search.sort === option.value ? "opacity-100" : "opacity-60")} />
                                    <span>{option.label}</span>
                                </div>
                                {search.sort === option.value && (
                                    <CheckIcon className="h-3 w-3" weight="bold" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Clear Actions */}
                    {activeFilterCount > 0 && (
                        <div className="border-t bg-muted/20 p-1">
                            <Button
                                variant="ghost"
                                className="h-7 w-full gap-1.5 text-[10px] font-medium text-destructive hover:bg-muted hover:text-foreground"
                                onClick={() => {
                                    setLocalQuery('')
                                    navigate({ search: { sort: 'newest' } })
                                }}
                            >
                                <XIcon className="h-3 w-3" />
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
