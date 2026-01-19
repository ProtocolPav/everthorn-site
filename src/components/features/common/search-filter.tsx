import { useEffect, useState } from 'react'
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    FunnelSimpleIcon,
    CheckIcon,
    XCircleIcon,
    Icon as PhosphorIcon
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from "motion/react"

interface StatusOption {
    value: string
    label: string
    icon: PhosphorIcon
    activeClass: string
    dotClass?: string
}

interface SortOption {
    value: string
    label: string
    icon: PhosphorIcon
}

interface QueryConfig {
    placeholder?: string
    debounceMs?: number
}

interface SearchFilterConfig {
    statusOptions?: StatusOption[]
    sortOptions: SortOption[]
    query?: QueryConfig
    itemLabel: string
}

interface Search {
    query?: string
    status?: string[]
    sort?: string
}

interface SearchFilterProps {
    config: SearchFilterConfig
    search: Search
    itemCount?: number
    onFilterChange: (updates: Partial<Search> ) => void
    onClear?: () => void
}

export function SearchFilter({ config, search, itemCount, onFilterChange, onClear }: SearchFilterProps) {
    const [localQuery, setLocalQuery] = useState(search.query || '')

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (localQuery !== search.query) {
                onFilterChange({ query: localQuery || undefined })
            }
        }, config.query?.debounceMs ?? 300)
        return () => clearTimeout(timeoutId)
    }, [localQuery, search.query, onFilterChange, config.query?.debounceMs])

    useEffect(() => {
        if (search.query !== localQuery) setLocalQuery(search.query || '')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.query])

    const handleStatusToggle = (status: string) => {
        const current = search.status ? [...search.status] : []

        const newStatus = current.includes(status)
            ? current.filter(s => s !== status)
            : [...current, status]

        onFilterChange({ status: newStatus.length > 0 ? newStatus : undefined })
    }

    return (
        <div className={cn("mb-2 w-1/2 mx-auto", localQuery ? "sticky top-1 z-10" : '')}>
            <Card className={cn('border-background p-0', localQuery ? 'bg-background' : 'bg-transparent')}>
                <CardContent className={'flex p-1.5'}>
                    <motion.div
                        layout
                        className="flex-1"
                    >
                        <InputGroup>
                            <InputGroupInput
                                placeholder={config.query?.placeholder || "Search..."}
                                value={localQuery}
                                onChange={(e) => setLocalQuery(e.target.value)}
                            />
                            <InputGroupAddon>
                                <MagnifyingGlassIcon />
                            </InputGroupAddon>
                            {localQuery && (
                                <InputGroupAddon align="inline-end">
                                    <Button
                                        onClick={() => {
                                            setLocalQuery('')
                                            if (onClear) {
                                                onClear()
                                            } else {
                                                onFilterChange({ query: undefined, sort: config.sortOptions[0].value, status: undefined })
                                            }
                                        }}
                                        size={'icon-sm'}
                                        variant={'invisible'}
                                    >
                                        <XCircleIcon className="h-3.5 w-3.5" weight="fill" />
                                    </Button>
                                </InputGroupAddon>
                            )}
                        </InputGroup>
                    </motion.div>

                    <AnimatePresence>
                        {localQuery && (
                            <motion.div
                                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                                animate={{ width: "auto", opacity: 1, marginLeft: "0.4rem" }}
                                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                                className="overflow-hidden shrink-0"
                            >
                                <ButtonGroup>
                                    <Button variant="outline" className={'text-xs p-2.5'}>
                                        {itemCount} {config.itemLabel}
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
                                                        {config.statusOptions?.map((statusOption) => {
                                                            const isSelected = !!search.status?.includes(statusOption.value)
                                                            const Icon = statusOption.icon

                                                            return (
                                                                <Badge
                                                                    key={statusOption.value}
                                                                    variant="outline"
                                                                    onClick={() => handleStatusToggle(statusOption.value)}
                                                                    className={cn(
                                                                        "cursor-pointer px-2.5 py-1 text-[11px] font-medium transition-all duration-200 select-none gap-1.5 border",
                                                                        isSelected
                                                                            ? statusOption.activeClass
                                                                            : "border-transparent bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                                                                    )}
                                                                >
                                                                    <Icon weight={isSelected ? "fill" : "regular"} className="h-3.5 w-3.5" />
                                                                    {statusOption.label}
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

                                        <PopoverContent className="w-[200px] p-1 shadow-lg" align="end" sideOffset={4}>
                                            <div className="flex gap-1 flex-col">
                                                {config.sortOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        onClick={() => onFilterChange({ sort: option.value })}
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}
