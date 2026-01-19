import { useEffect, useState } from 'react'
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ClockCounterClockwiseIcon, CheckCircleIcon, HandWavingIcon, SealQuestionIcon, FunnelSimpleIcon,
    SortAscendingIcon, SortDescendingIcon, TextAaIcon, CheckIcon, XCircleIcon
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import {useNavigate} from "@tanstack/react-router";
import {Route} from "@/routes/admin/projects.tsx";

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

interface ProjectSearchFilterProps {
    search: {
        query?: string
        status?: string[]
        sort: string
    }
    projectCount?: number
}

export function ProjectSearchFilter({ search, projectCount }: ProjectSearchFilterProps) {
    const [localQuery, setLocalQuery] = useState(search.query || '')
    const navigate = useNavigate({ from: Route.fullPath })

    const updateFilter = (updates: Partial<typeof search>) => {
        navigate({
            search: (prev) => ({ ...prev, ...updates }),
            replace: true,
        })
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (localQuery !== search.query) {
                updateFilter({ query: localQuery || undefined })
            }
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [localQuery, search.query, updateFilter])

    useEffect(() => {
        if (search.query !== localQuery) setLocalQuery(search.query || '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.query])

    const handleStatusToggle = (status: string) => {
        const current = search.status ? [...search.status] : []
        const statusValue = status as keyof typeof statusConfig

        const newStatus = current.includes(statusValue)
            ? current.filter(s => s !== statusValue)
            : [...current, statusValue]

        updateFilter({ status: newStatus.length > 0 ? newStatus : undefined })
    }

    return (
        <div className={cn("mb-6 w-1/2 mx-auto", search.query ? "sticky top-6 z-10" : '')}>
            <Card className={'bg-background p-0'}>
                <CardContent className={'flex gap-1.5 p-1.5'}>
                    <InputGroup>
                        <InputGroupInput
                            placeholder="Search..."
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                        />
                        <InputGroupAddon>
                            <MagnifyingGlassIcon />
                        </InputGroupAddon>
                        {localQuery && (
                            <InputGroupAddon align="inline-end">
                                <Button
                                    onClick={async () => {
                                        setLocalQuery('')
                                        await navigate({ search: { sort: 'newest', status: undefined } })
                                    }}
                                    size={'icon-sm'}
                                    variant={'invisible'}
                                >
                                    <XCircleIcon className="h-3.5 w-3.5" weight="fill" />
                                </Button>
                            </InputGroupAddon>
                        )}
                    </InputGroup>

                    {search.query && (
                        <>
                            <ButtonGroup>
                                <Button variant="outline" className={'text-xs p-2.5'}>
                                    {projectCount} Projects
                                </Button>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size={'icon'}>
                                            <FunnelIcon className="h-3.5 w-3.5" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-[280px] p-0 shadow-lg" align="end" sideOffset={4}>
                                        <div className="flex flex-col">
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
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" size={'icon'}>
                                            <FunnelSimpleIcon className="h-3.5 w-3.5" />
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-[200px] p-0 shadow-lg" align="end" sideOffset={4}>
                                        <div className="flex flex-col">
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
                                    </PopoverContent>
                                </Popover>
                            </ButtonGroup>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}