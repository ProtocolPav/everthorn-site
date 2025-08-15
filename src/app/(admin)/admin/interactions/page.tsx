'use client';

import React, { useEffect, useCallback } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {Search, Filter, X, MapPin, User, Sword, Clock, HelpCircle, ChevronDown, Settings, CalendarIcon} from 'lucide-react';
import Image from 'next/image';
import { usePageTitle } from "@/hooks/use-context";
import { useInteractions } from '@/hooks/use-interactions';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { InteractionRow } from '@/components/features/interactions/interaction-row';
import { interactionTypes, dimensions } from '@/lib/interactions';
import { Badge } from '@/components/ui/badge';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import {Calendar} from "@/components/ui/calendar";

export default function InteractionsPage() {
    const { setTitle } = usePageTitle();
    const {
        searchTerm,
        setSearchTerm,
        uiFilters,
        debouncedFilters,
        debouncedSearchTerm,
        filteredInteractions,
        handleFilterChange,
        clearFilters,
        size,
        setSize,
        isValidating,
        isLoadingMore,
        isReachingEnd,
        error,
        getActiveFilterCount
    } = useInteractions();

    // Set page title
    useEffect(() => {
        setTitle("Interactions Searching (BETA)");
    }, [setTitle]);

    // Infinite scroll callback
    const loadMore = useCallback(() => {
        if (!isLoadingMore && !isReachingEnd && filteredInteractions.length > 0) {
            setSize(size + 1);
        }
    }, [size, setSize, isLoadingMore, isReachingEnd, filteredInteractions.length]);

    const loadingRef = useInfiniteScroll(loadMore, !!isLoadingMore, !isReachingEnd);

    return (
        <div className="grid gap-3">
            {/* Filters Section */}
            <Card className="bg-muted/15 border-none p-0">
                <CardContent className="p-2 grid gap-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-primary/10 rounded-lg">
                                <Filter className="h-4 w-4 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold">Search & Filter</h2>
                            {getActiveFilterCount() > 0 && (
                                <div className="inline-flex items-center bg-muted/50 rounded-md p-0.5">
                                    <div className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-sm">
                                        {getActiveFilterCount()} filters
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="h-6 px-2 text-xs hover:bg-destructive/20 hover:text-destructive ml-0.5 rounded-sm"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}


                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-full">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">Live</span>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-bold">{filteredInteractions.length}</div>
                                <div className="text-xs text-muted-foreground">results</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Search & Filter*/}
                    <div className={'flex gap-3 items-center'}>
                        <div className="relative group flex-1 min-w-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                type="text"
                                value={uiFilters.references[0] || ''}
                                onChange={(e) => handleFilterChange('references', e.target.value ? [e.target.value] : [])}
                                placeholder="Search blocks or entities..."
                                className="pl-10 pr-12"
                            />
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-help p-1 hover:bg-muted/50 rounded-sm transition-colors">
                                            <div className="flex items-center gap-1">
                                                <kbd className="px-1 py-0.5 bg-amber-200 dark:bg-amber-800 rounded text-xs font-mono text-amber-800 dark:text-amber-200 leading-none">
                                                    %
                                                </kbd>
                                                <HelpCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                            </div>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="end" className="max-w-xs text-xs border">
                                        <div className="space-y-1.5">
                                            <p className="font-medium text-xs">Wildcard Search Examples:</p>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">%ore</kbd>
                                                    <span className="text-muted-foreground">ends with "ore"</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">acacia%</kbd>
                                                    <span className="text-muted-foreground">starts with "acacia"</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">%stone%</kbd>
                                                    <span className="text-muted-foreground">contains "stone"</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        <div className="w-48 flex-shrink-0">
                            <Select
                                value={uiFilters.interaction_types[0] || 'all'}
                                onValueChange={(value) =>
                                    handleFilterChange('interaction_types', value === 'all' ? [] : [value])
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All interaction types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All interaction types</SelectItem>
                                    {Object.entries(interactionTypes).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                <config.icon className="w-4 h-4" />
                                                {config.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-40 flex-shrink-0">
                            <Select
                                value={uiFilters.dimensions[0] || 'all'}
                                onValueChange={(value) =>
                                    handleFilterChange('dimensions', value === 'all' ? [] : [value])
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="All dimensions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All dimensions</SelectItem>
                                    {Object.entries(dimensions).map(([key, config]) => (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={config.img}
                                                    alt={config.label}
                                                    width={16}
                                                    height={16}
                                                    className="object-cover rounded-sm"
                                                />
                                                {config.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Advanced Filters - Collapsible */}
                    <Collapsible>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between p-2 h-8 hover:bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    <span className="font-medium">Advanced Filters</span>
                                    {(uiFilters.thorny_ids.length > 0 || uiFilters.coordinates.length > 0 ||
                                        uiFilters.coordinates_end.length > 0 || uiFilters.time_start || uiFilters.time_end) && (
                                        <Badge variant="secondary" className="h-4 text-xs">
                                            {[
                                                uiFilters.thorny_ids.length > 0,
                                                uiFilters.coordinates.length > 0,
                                                uiFilters.coordinates_end.length > 0,
                                                uiFilters.time_start,
                                                uiFilters.time_end
                                            ].filter(Boolean).length}
                                        </Badge>
                                    )}
                                </div>
                                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-3 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {/* User IDs */}
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        type="text"
                                        value={uiFilters.thorny_ids.join(', ')}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '') {
                                                handleFilterChange('thorny_ids', []);
                                                return;
                                            }
                                            const ids = value
                                                .split(',')
                                                .map(id => parseInt(id.trim()))
                                                .filter(id => !isNaN(id));
                                            handleFilterChange('thorny_ids', ids);
                                        }}
                                        placeholder="User's ThornyID..."
                                        className="pl-10 pr-12"
                                    />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-help p-1 hover:bg-muted/50 rounded-sm transition-colors">
                                                    <div className="flex items-center gap-1">
                                                        <HelpCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" align="end" className="max-w-xs text-xs">
                                                <div className="space-y-1.5">
                                                    <p className="font-medium text-xs">ThornyID Examples:</p>
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">1</kbd>
                                                            <span className="text-muted-foreground">is protocolpav</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">1144</kbd>
                                                            <span className="text-muted-foreground">is kekkaygenkai</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-muted-foreground">You must know the ThornyID</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                {/* Coordinates From */}
                                <div className="relative group">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        type="text"
                                        value={uiFilters.coordinates[0] || ''}
                                        onChange={(e) => {
                                            const value = e.target.value.trim();
                                            handleFilterChange('coordinates', value ? [value] : []);
                                        }}
                                        placeholder="From coordinates..."
                                        className="pl-10 pr-12"
                                    />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-help p-1 hover:bg-muted/50 rounded-sm transition-colors">
                                                    <div className="flex items-center gap-1">
                                                        <HelpCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" align="end" className="max-w-60 text-xs">
                                                <div className="space-y-1.5">
                                                    <p className="font-medium text-xs">Coordinate Examples:</p>
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">100,64,200</kbd>
                                                            <span className="text-muted-foreground">starting point</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <span className="text-muted-foreground">For start & end, the z-coords are finnicky. Try swapping them around if there are no results</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                {/* Coordinates To */}
                                <div className="relative group">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        type="text"
                                        value={uiFilters.coordinates_end[0] || ''}
                                        onChange={(e) => {
                                            const value = e.target.value.trim();
                                            handleFilterChange('coordinates_end', value ? [value] : []);
                                        }}
                                        placeholder="To coordinates..."
                                        className="pl-10 pr-12"
                                    />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-help p-1 hover:bg-muted/50 rounded-sm transition-colors">
                                                    <div className="flex items-center gap-1">
                                                        <HelpCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="bottom" align="end" className="max-w-xs text-xs">
                                                <div className="space-y-1.5">
                                                    <p className="font-medium text-xs">Coordinate Examples:</p>
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">200,100,300</kbd>
                                                            <span className="text-muted-foreground">ending point</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Start Time */}
                                <div className="space-y-1">
                                    <div className="relative group">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {uiFilters.time_start ? (
                                                        format(new Date(uiFilters.time_start), "PPP p")
                                                    ) : (
                                                        <span>Pick start date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={uiFilters.time_start ? new Date(uiFilters.time_start) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            const isoString = date.toISOString().slice(0, 16);
                                                            handleFilterChange('time_start', isoString);
                                                        } else {
                                                            handleFilterChange('time_start', '');
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                                <div className="p-3 border-t">
                                                    <Input
                                                        type="time"
                                                        value={uiFilters.time_start ? uiFilters.time_start.slice(11, 16) : ''}
                                                        onChange={(e) => {
                                                            const timeValue = e.target.value;
                                                            if (uiFilters.time_start) {
                                                                const date = uiFilters.time_start.slice(0, 10);
                                                                handleFilterChange('time_start', `${date}T${timeValue}`);
                                                            }
                                                        }}
                                                        className="h-8"
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-help p-1 hover:bg-muted/50 rounded-sm transition-colors">
                                                        <HelpCircle className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" align="end" className="max-w-xs text-xs">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="text-muted-foreground">Filter interactions to start from this time</span>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                {/* End Time */}
                                <div className="space-y-1">
                                    <div className="relative group">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {uiFilters.time_end ? (
                                                        format(new Date(uiFilters.time_end), "PPP p")
                                                    ) : (
                                                        <span>Pick end date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={uiFilters.time_end ? new Date(uiFilters.time_end) : undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            const isoString = date.toISOString().slice(0, 16);
                                                            handleFilterChange('time_end', isoString);
                                                        } else {
                                                            handleFilterChange('time_end', '');
                                                        }
                                                    }}
                                                    initialFocus
                                                />
                                                <div className="p-3 border-t">
                                                    <Input
                                                        type="time"
                                                        value={uiFilters.time_end ? uiFilters.time_end.slice(11, 16) : ''}
                                                        onChange={(e) => {
                                                            const timeValue = e.target.value;
                                                            if (uiFilters.time_end) {
                                                                const date = uiFilters.time_end.slice(0, 10);
                                                                handleFilterChange('time_end', `${date}T${timeValue}`);
                                                            }
                                                        }}
                                                        className="h-8"
                                                    />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-help p-1 hover:bg-muted/50 rounded-sm transition-colors">
                                                        <HelpCircle className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom" align="end" className="text-xs">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className="text-muted-foreground">Filter interactions to end at this time</span>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </CardContent>
            </Card>

            {/* Interactions Table */}
            <Card className="p-0">
                <CardContent className="p-0">
                    <ScrollArea className="h-130 rounded-lg overflox-x-auto">
                        <Table>
                            <TableHeader className="rounded-md">
                                <TableRow>
                                    <TableHead className="w-[140px]">User</TableHead>
                                    <TableHead className="w-[120px]">Action</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Mainhand</TableHead>
                                    <TableHead className="w-[160px]">Location</TableHead>
                                    <TableHead className="w-[150px]">Time</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="pr-5">
                                {filteredInteractions.length === 0 && !isValidating ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            No interactions found
                                            <br />
                                            <span className="text-sm">Try adjusting your filters or search terms</span>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {filteredInteractions.map((interaction, index) => (
                                            <InteractionRow
                                                key={`${interaction.interaction_id}-${index}`}
                                                interaction={interaction}
                                            />
                                        ))}

                                        {/* Loading rows */}
                                        {isValidating && (
                                            <>
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <TableRow key={`loading-${i}`}>
                                                        <TableCell className="w-[140px]"><Skeleton className="h-4 w-16" /></TableCell>
                                                        <TableCell className="w-[120px]"><Skeleton className="h-6 w-20" /></TableCell>
                                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                                        <TableCell className="w-[160px]"><Skeleton className="h-4 w-24" /></TableCell>
                                                        <TableCell className="w-[150px]"><Skeleton className="h-4 w-32" /></TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )}

                                        {/* Infinite scroll trigger */}
                                        <TableRow ref={loadingRef}>
                                            <TableCell colSpan={6} className="text-center py-8">
                                                {isValidating ? (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="text-sm text-muted-foreground">Loading more interactions...</span>
                                                        </div>
                                                        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
                                                            <div className="w-full h-full bg-primary rounded-full animate-pulse"></div>
                                                        </div>
                                                    </div>
                                                ) : isReachingEnd && filteredInteractions.length > 0 ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-muted-foreground text-sm">
                                                          No more interactions to load
                                                        </span>
                                                        <span className="text-xs text-muted-foreground/70">
                                                          {filteredInteractions.length} total interactions loaded
                                                        </span>
                                                    </div>
                                                ) : filteredInteractions.length === 0 && isValidating ? (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="text-sm text-muted-foreground">Loading interactions...</span>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </TableBody>
                        </Table>

                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
