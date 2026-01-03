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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { XCircleIcon, FunnelIcon } from "@phosphor-icons/react"
import { Route } from '@/routes/admin/projects'

// Schema definition
export const projectsSearchSchema = z.object({
    query: z.string().optional(),
    status: z.array(z.enum(["pending", "ongoing", "abandoned", "completed"])).optional(),
    sort: z.enum(['newest', 'oldest', 'name']).catch('newest'),
})

export function ProjectsFilter() {
    const navigate = useNavigate({ from: Route.fullPath })
    const search = Route.useSearch()

    // Local state for immediate input feedback without lagging the URL
    const [localQuery, setLocalQuery] = useState(search.query || '')

    // Debounce the search input updates to the URL
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (localQuery !== search.query) {
                navigate({
                    search: (prev) => ({ ...prev, query: localQuery || undefined }),
                    replace: true,
                })
            }
        }, 300) // 300ms delay

        return () => clearTimeout(timeoutId)
    }, [localQuery, navigate, search.query])

    // Sync local state if URL changes externally (e.g. back button)
    useEffect(() => {
        if (search.query !== localQuery) {
            setLocalQuery(search.query || '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search.query])

    const updateFilter = (updates: Partial<typeof search>) => {
        navigate({
            search: (prev) => ({ ...prev, ...updates }),
            replace: true,
        })
    }

    const handleStatusToggle = (status: string) => {
        // Ensure we always have an array to work with
        const current = search.status ? [...search.status] : []
        const statusValue = status as "pending" | "ongoing" | "abandoned" | "completed"

        let newStatus: typeof current

        if (current.includes(statusValue)) {
            // Remove it
            newStatus = current.filter(s => s !== statusValue)
        } else {
            // Add it
            newStatus = [...current, statusValue]
        }

        // Optimistically update or just wait for router
        // Passing undefined removes the key from URL if empty
        updateFilter({ status: newStatus.length > 0 ? newStatus : undefined })
    }

    const activeFilterCount = (search.query ? 1 : 0) + (search.status?.length || 0)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 border-dashed text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    <FunnelIcon className="h-3.5 w-3.5" />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-0.5 h-4 px-1 text-[10px]">
                            {activeFilterCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Filters</h4>
                        <p className="text-xs text-muted-foreground">
                            Narrow down the project list.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="search">Search</Label>
                        <Input
                            id="search"
                            placeholder="Project name..."
                            className="h-8"
                            value={localQuery}
                            onChange={(e) => setLocalQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {["pending", "ongoing", "completed", "abandoned"].map((status) => (
                                <div key={status} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={status}
                                        checked={!!search.status?.includes(status as any)}
                                        onCheckedChange={() => handleStatusToggle(status)}
                                    />
                                    <Label htmlFor={status} className="capitalize cursor-pointer text-xs font-normal">
                                        {status}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Sort By</Label>
                        <Select
                            value={search.sort}
                            onValueChange={(val) => updateFilter({ sort: val as any })}
                        >
                            <SelectTrigger className="h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {activeFilterCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-full text-muted-foreground"
                            onClick={() => {
                                setLocalQuery('') // Reset local state immediately
                                navigate({ search: { sort: 'newest' } }) // Reset URL
                            }}
                        >
                            <XCircleIcon className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
