import {
    CheckIcon,
    WarningCircleIcon,
} from '@phosphor-icons/react'
import {Button} from '@/components/ui/button.tsx'
import {Badge} from '@/components/ui/badge.tsx'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover.tsx'
import {ScrollArea} from '@/components/ui/scroll-area.tsx'
import {CopyJsonButton} from '@/components/features/quests/footer/copy-json-button.tsx'
import {LoadJsonDialog} from '@/components/features/quests/footer/load-json-dialog.tsx'
import {EditRawDialog} from '@/components/features/quests/footer/edit-raw-dialog.tsx'

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

    return (
        <div className="sticky bottom-0 -mx-4 -mb-4 flex items-center justify-between gap-4 border-t bg-background/80 px-4 py-3 backdrop-blur-sm sm:-mx-6 sm:-mb-6 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <Button
                    variant="default"
                    type="submit"
                    size="sm"
                    disabled={
                        submitStatus === 'loading' ||
                        submitStatus === 'success'
                    }
                    className="min-w-32 transition-all"
                >
                    {submitStatus === 'loading' ? (
                        <>
                            <svg
                                className="size-4 animate-spin"
                                viewBox="0 0 16 16"
                                fill="none"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="8"
                                    cy="8"
                                    r="6"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeDasharray="28 10"
                                    strokeLinecap="round"
                                />
                            </svg>
                            {isEditing ? 'Saving…' : 'Creating…'}
                        </>
                    ) : submitStatus === 'success' ? (
                        <>
                            <CheckIcon
                                weight="bold"
                                className="animate-in zoom-in-0 duration-200"
                            />
                            {isEditing ? 'Saved' : 'Created'}
                        </>
                    ) : (
                        <>{isEditing ? 'Save Changes' : 'Create Quest'}</>
                    )}
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
                                    className="size-4"
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