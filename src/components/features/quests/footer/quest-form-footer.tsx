import {
    CheckIcon,
    FloppyDiskIcon,
    PlusIcon,
    SpinnerGapIcon,
    WarningCircleIcon,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CopyJsonButton } from '@/components/features/quests/footer/copy-json-button'
import { LoadJsonDialog } from '@/components/features/quests/footer/load-json-dialog'
import { EditRawDialog } from '@/components/features/quests/footer/edit-raw-dialog'
import { cn } from '@/lib/utils'

export type SubmitStatus = 'idle' | 'loading' | 'success'

interface QuestFormFooterProps {
    isEditing: boolean
    submitStatus: SubmitStatus
    formValues: object
    onApplyValues: (parsed: object) => void
    validationErrors?: Array<{
        field: string
        message: string
        path?: string
    }>
}

export function QuestFormFooter({
                                    isEditing,
                                    submitStatus,
                                    formValues,
                                    onApplyValues,
                                    validationErrors = [],
                                }: QuestFormFooterProps) {
    const hasValidationErrors = validationErrors.length > 0
    const isLoading = submitStatus === 'loading'
    const isSuccess = submitStatus === 'success'

    const idleLabel = isEditing ? 'Save Changes' : 'Create Quest'
    const loadingLabel = isEditing ? 'Saving…' : 'Creating…'
    const successLabel = isEditing ? 'Saved' : 'Created'

    return (
        <div className="sticky bottom-0 -mx-4 -mb-4 flex items-center justify-between gap-4 border-t bg-background/80 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:-mb-6 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <Button
                    type="submit"
                    size="sm"
                    disabled={isLoading || isSuccess}
                    className="relative isolate overflow-hidden select-none transition-colors duration-200"
                >
                    {/* Success background overlay to prevent class-swapping background flashes */}
                    <span
                        aria-hidden="true"
                        className={cn(
                            'pointer-events-none absolute inset-0 -z-10 bg-emerald-600 transition-opacity duration-300',
                            isSuccess ? 'opacity-100' : 'opacity-0'
                        )}
                    />

                    {/* CSS Grid cell to stack all button states without layout shift */}
                    <span className="grid grid-cols-1 grid-rows-1 items-center justify-items-center">
                        {/* 1. Idle State */}
                        <span
                            className={cn(
                                'col-start-1 row-start-1 flex items-center justify-center gap-2 transition-all duration-200',
                                submitStatus === 'idle'
                                    ? 'scale-100 opacity-100'
                                    : 'pointer-events-none scale-90 opacity-0'
                            )}
                        >
                            {isEditing ? (
                                <FloppyDiskIcon
                                    weight="bold"
                                    className="size-4 shrink-0"
                                />
                            ) : (
                                <PlusIcon
                                    weight="bold"
                                    className="size-4 shrink-0"
                                />
                            )}
                            <span>{idleLabel}</span>
                        </span>

                        {/* 2. Loading State */}
                        <span
                            aria-hidden={!isLoading}
                            className={cn(
                                'col-start-1 row-start-1 flex items-center justify-center gap-2 transition-all duration-200',
                                isLoading
                                    ? 'scale-100 opacity-100'
                                    : 'pointer-events-none scale-90 opacity-0'
                            )}
                        >
                            <SpinnerGapIcon
                                weight="bold"
                                className="size-4 shrink-0 animate-spin"
                            />
                            <span>{loadingLabel}</span>
                        </span>

                        {/* 3. Success State */}
                        <span
                            aria-hidden={!isSuccess}
                            className={cn(
                                'col-start-1 row-start-1 flex items-center justify-center gap-2 text-white transition-all duration-200',
                                isSuccess
                                    ? 'scale-100 opacity-100'
                                    : 'pointer-events-none scale-90 opacity-0'
                            )}
                        >
                            <CheckIcon
                                weight="bold"
                                className="size-4 shrink-0"
                            />
                            <span>{successLabel}</span>
                        </span>
                    </span>
                </Button>

                {hasValidationErrors && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1.5 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                                <WarningCircleIcon
                                    weight="fill"
                                    className="size-4 shrink-0"
                                />
                                <span className="hidden sm:inline">
                                    {validationErrors.length} issue
                                    {validationErrors.length === 1 ? '' : 's'}
                                </span>
                                <Badge
                                    variant="destructive"
                                    className="h-5 min-w-5 rounded-full px-1.5"
                                >
                                    {validationErrors.length}
                                </Badge>
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            side="top"
                            align="start"
                            className="w-96 p-2"
                        >
                            <div className="px-2 pb-2 pt-1">
                                <p className="font-medium">
                                    Fix these before submitting
                                </p>
                            </div>

                            <ScrollArea className="max-h-72">
                                <div className="space-y-1">
                                    {validationErrors.map((error, index) => (
                                        <Button
                                            key={`${error.path ?? error.field}-${index}`}
                                            type="button"
                                            variant="ghost"
                                            className="h-auto w-full justify-start gap-2 whitespace-normal px-2 py-2 text-left hover:bg-muted"
                                        >
                                            <WarningCircleIcon
                                                weight="fill"
                                                className="mt-0.5 size-4 shrink-0 text-destructive"
                                            />

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-medium">
                                                    {error.field}
                                                </span>
                                                <span className="block text-sm font-normal text-muted-foreground">
                                                    {error.message}
                                                </span>
                                            </span>
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </PopoverContent>
                    </Popover>
                )}
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
                <CopyJsonButton values={formValues} />
                <LoadJsonDialog onApply={onApplyValues} />
                <EditRawDialog
                    values={formValues}
                    onApply={onApplyValues}
                />
            </div>
        </div>
    )
}