import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
    FunnelIcon,
    MagnifyingGlassIcon,
    UserIcon,
    MapPinIcon,
    CalendarIcon,
    ArrowsClockwiseIcon,
    GearIcon,
    CaretDownIcon,
    QuestionIcon,
} from '@phosphor-icons/react';
import { format } from 'date-fns';
import { interactionTypes, dimensions } from '@/config/interactions-config.ts';
import type { UIFilters } from '@/types/interactions';

function toISOWithTZ(date: Date): string {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? '+' : '-';
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
    return (
        date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        diff + pad(tzOffset / 60) + ':' + pad(tzOffset % 60)
    );
}

// ─── InputWithTooltip ─────────────────────────────────────────────────────────

interface InputWithTooltipProps {
    icon: React.ReactNode;
    value: string | number;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    placeholder: string;
    tooltip: React.ReactNode;
    tooltipColor: string;
}

function InputWithTooltip({ icon, value, onChange, placeholder, tooltip, tooltipColor }: InputWithTooltipProps) {
    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {icon}
            </span>
            <Input value={value} onChange={onChange} placeholder={placeholder} className="pl-10 pr-8" />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 cursor-help p-1 hover:bg-muted/50 rounded-sm transition-colors">
                            <QuestionIcon className={`size-3 ${tooltipColor}`} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="end" className="max-w-xs text-xs">
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

// ─── DateTimeFilter ───────────────────────────────────────────────────────────

interface DateTimeFilterProps {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    defaultTime: { h: number; m: number; s: number };
    tooltipText: string;
}

function DateTimeFilter({ value, onChange, placeholder, defaultTime, tooltipText }: DateTimeFilterProps) {
    return (
        <div className="relative">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 size-4" />
                        {value
                            ? <span className="truncate">{format(new Date(value), 'PPP p')}</span>
                            : <span>{placeholder}</span>
                        }
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value ? new Date(value) : undefined}
                        onSelect={(date) => {
                            if (date) {
                                const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), defaultTime.h, defaultTime.m, defaultTime.s);
                                onChange(toISOWithTZ(d));
                            } else {
                                onChange('');
                            }
                        }}
                        initialFocus
                    />
                    <div className="p-3 border-t">
                        <Input
                            type="time"
                            value={value ? new Date(value).toTimeString().slice(0, 5) : ''}
                            onChange={(e) => {
                                if (value && e.target.value) {
                                    const d = new Date(value);
                                    const [h, m] = e.target.value.split(':');
                                    d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
                                    onChange(toISOWithTZ(d));
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
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 cursor-help p-1 hover:bg-muted/50 rounded-sm transition-colors">
                            <QuestionIcon className="size-3 text-purple-600 dark:text-purple-400" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="end" className="text-xs">
                        <span className="text-muted-foreground">{tooltipText}</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

// ─── InteractionsFilter ───────────────────────────────────────────────────────

interface InteractionsFilterProps {
    uiFilters: UIFilters;
    activeFilterCount: number;
    resultCount: number;
    isFetching: boolean;
    isAutoRefreshEnabled: boolean;
    onFilterChange: <K extends keyof UIFilters>(field: K, value: UIFilters[K]) => void;
    onClearFilters: () => void;
    onRefresh: () => void;
    onToggleAutoRefresh: () => void;
}

export function InteractionsFilter({
                                       uiFilters,
                                       activeFilterCount,
                                       resultCount,
                                       isFetching,
                                       isAutoRefreshEnabled,
                                       onFilterChange,
                                       onClearFilters,
                                       onRefresh,
                                       onToggleAutoRefresh,
                                   }: InteractionsFilterProps) {
    const advancedFilterCount = [
        uiFilters.thorny_ids.length > 0,
        uiFilters.coordinates.length > 0,
        uiFilters.coordinates_end.length > 0,
        !!uiFilters.time_start,
        !!uiFilters.time_end,
    ].filter(Boolean).length;

    return (
        <Card className="bg-muted/15 border-none p-0">
            <CardContent className="p-2 grid gap-2">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-primary/10 rounded-lg">
                            <FunnelIcon className="size-4 text-primary" />
                        </div>
                        <h2 className="text-lg font-bold">Search & Filter</h2>

                        {activeFilterCount > 0 && (
                            <div className="inline-flex items-center bg-muted/50 rounded-md p-0.5">
                                <div className="px-2 py-1 bg-primary/20 text-primary text-xs font-medium rounded-sm">
                                    {activeFilterCount} filters
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onClearFilters}
                                    className="h-6 px-2 text-xs hover:bg-destructive/20 hover:text-destructive ml-0.5 rounded-sm"
                                >
                                    Clear
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            disabled={isFetching}
                            className="h-8 gap-2"
                        >
                            <ArrowsClockwiseIcon className={`size-3 ${isFetching ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>

                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggleAutoRefresh}
                                className={`h-6 px-2 text-xs rounded-sm gap-1 transition-colors ${
                                    isAutoRefreshEnabled
                                        ? 'hover:bg-emerald-100 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300'
                                        : 'hover:bg-muted hover:text-foreground'
                                }`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    isAutoRefreshEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'
                                }`} />
                                <span className={isAutoRefreshEnabled
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-muted-foreground'
                                }>
                                    {isAutoRefreshEnabled ? 'Live' : 'Paused'}
                                </span>
                            </Button>

                            <div className="text-right">
                                <div className="text-lg font-bold tabular-nums">{resultCount}</div>
                                <div className="text-xs text-muted-foreground">results</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick search + type + dimension */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="relative group flex-1 min-w-0">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                        <Input
                            value={uiFilters.references[0] ?? ''}
                            onChange={(e) =>
                                onFilterChange('references', e.target.value ? [e.target.value] : [])
                            }
                            placeholder="Search blocks or entities..."
                            className="pl-10 pr-12"
                        />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 cursor-help p-1 hover:bg-muted/50 rounded-sm transition-colors">
                                        <div className="flex items-center gap-1">
                                            <kbd className="px-1 py-0.5 bg-amber-200 dark:bg-amber-800 rounded text-xs font-mono text-amber-800 dark:text-amber-200 leading-none">
                                                %
                                            </kbd>
                                            <QuestionIcon className="size-3 text-amber-600 dark:text-amber-400" />
                                        </div>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" align="end" className="max-w-xs text-xs border">
                                    <p className="font-medium mb-1.5">Wildcard Search Examples:</p>
                                    {([
                                        ['%ore', 'ends with "ore"'],
                                        ['acacia%', 'starts with "acacia"'],
                                        ['%stone%', 'contains "stone"'],
                                    ] as const).map(([ex, desc]) => (
                                        <div key={ex} className="flex items-center gap-2 mb-1">
                                            <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono">{ex}</kbd>
                                            <span className="text-muted-foreground">{desc}</span>
                                        </div>
                                    ))}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Select
                            value={uiFilters.interaction_types[0] ?? 'all'}
                            onValueChange={(v) =>
                                onFilterChange('interaction_types', v === 'all' ? [] : [v])
                            }
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="All interaction types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All interaction types</SelectItem>
                                {Object.entries(interactionTypes).map(([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                            <config.icon className="size-4" />
                                            {config.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={uiFilters.dimensions[0] ?? 'all'}
                            onValueChange={(v) =>
                                onFilterChange('dimensions', v === 'all' ? [] : [v])
                            }
                        >
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue placeholder="All dimensions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All dimensions</SelectItem>
                                {Object.entries(dimensions).map(([key, config]) => (
                                    <SelectItem key={key} value={key}>
                                        <div className="flex items-center gap-2">
                                            <img
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

                {/* Advanced filters */}
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-2 h-8 hover:bg-muted/50">
                            <div className="flex items-center gap-2">
                                <GearIcon className="size-4" />
                                <span className="font-medium">Advanced Filters</span>
                                {advancedFilterCount > 0 && (
                                    <Badge variant="secondary" className="h-4 text-xs">
                                        {advancedFilterCount}
                                    </Badge>
                                )}
                            </div>
                            <CaretDownIcon className="size-4 transition-transform data-[state=open]:rotate-180" />
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <InputWithTooltip
                                icon={<UserIcon className="size-4" />}
                                value={uiFilters.thorny_ids.join(', ')}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    onFilterChange(
                                        'thorny_ids',
                                        raw === ''
                                            ? []
                                            : raw.split(',').map((s) => parseInt(s.trim(), 10)).filter(isFinite),
                                    );
                                }}
                                placeholder="User's ThornyID..."
                                tooltipColor="text-blue-600 dark:text-blue-400"
                                tooltip={
                                    <>
                                        <p className="font-medium mb-1.5">ThornyID Examples:</p>
                                        <div className="flex items-center gap-2 mb-1">
                                            <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono">1</kbd>
                                            <span className="text-muted-foreground">is protocolpav</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono">1144</kbd>
                                            <span className="text-muted-foreground">is kekkaygenkai</span>
                                        </div>
                                    </>
                                }
                            />
                            <InputWithTooltip
                                icon={<MapPinIcon className="size-4" />}
                                value={uiFilters.coordinates[0] ?? ''}
                                onChange={(e) => {
                                    const v = e.target.value.trim();
                                    onFilterChange('coordinates', v ? [v] : []);
                                }}
                                placeholder="From coordinates..."
                                tooltipColor="text-green-600 dark:text-green-400"
                                tooltip={
                                    <>
                                        <p className="font-medium mb-1.5">Coordinate Format:</p>
                                        <div className="flex items-center gap-2 mb-1">
                                            <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono">100,64,200</kbd>
                                            <span className="text-muted-foreground">starting point</span>
                                        </div>
                                        <p className="text-muted-foreground">Try swapping z-coords if no results appear</p>
                                    </>
                                }
                            />
                            <InputWithTooltip
                                icon={<MapPinIcon className="size-4" />}
                                value={uiFilters.coordinates_end[0] ?? ''}
                                onChange={(e) => {
                                    const v = e.target.value.trim();
                                    onFilterChange('coordinates_end', v ? [v] : []);
                                }}
                                placeholder="To coordinates..."
                                tooltipColor="text-green-600 dark:text-green-400"
                                tooltip={
                                    <>
                                        <p className="font-medium mb-1.5">Coordinate Format:</p>
                                        <div className="flex items-center gap-2">
                                            <kbd className="bg-muted px-1.5 py-0.5 rounded font-mono">200,100,300</kbd>
                                            <span className="text-muted-foreground">ending point</span>
                                        </div>
                                    </>
                                }
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <DateTimeFilter
                                value={uiFilters.time_start}
                                onChange={(v) => onFilterChange('time_start', v)}
                                placeholder="Pick start date"
                                defaultTime={{ h: 0, m: 0, s: 0 }}
                                tooltipText="Filter interactions to start from this time"
                            />
                            <DateTimeFilter
                                value={uiFilters.time_end}
                                onChange={(v) => onFilterChange('time_end', v)}
                                placeholder="Pick end date"
                                defaultTime={{ h: 23, m: 59, s: 59 }}
                                tooltipText="Filter interactions to end at this time"
                            />
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            </CardContent>
        </Card>
    );
}