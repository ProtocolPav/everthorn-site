import {CheckIcon} from "@phosphor-icons/react";
import {Button} from "@/components/ui/button.tsx";
import {CopyJsonButton} from "@/components/features/quests/footer/copy-json-button.tsx";
import {LoadJsonDialog} from "@/components/features/quests/footer/load-json-dialog.tsx";
import {EditRawDialog} from "@/components/features/quests/footer/edit-raw-dialog.tsx";

export type SubmitStatus = 'idle' | 'loading' | 'success';

interface QuestFormFooterProps {
    isEditing: boolean
    submitStatus: SubmitStatus
    formValues: object
    onApplyValues: (parsed: object) => void
}

export function QuestFormFooter({isEditing, submitStatus, formValues, onApplyValues}: QuestFormFooterProps) {
    return (
        <div className={'sticky bottom-0 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 bg-background/80 backdrop-blur-sm border-t px-4 sm:px-6 py-3 flex items-center justify-between'}>
            <Button
                variant={'default'}
                type={'submit'}
                size={"sm"}
                disabled={submitStatus === 'loading' || submitStatus === 'success'}
                className="min-w-32 transition-all"
            >
                {submitStatus === 'loading' ? (
                    <>
                        <svg className="size-4 animate-spin" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2.5" strokeDasharray="28 10" strokeLinecap="round" />
                        </svg>
                        {isEditing ? 'Saving…' : 'Creating…'}
                    </>
                ) : submitStatus === 'success' ? (
                    <>
                        <CheckIcon weight="bold" className="animate-in zoom-in-0 duration-200" />
                        {isEditing ? 'Saved' : 'Created'}
                    </>
                ) : (
                    isEditing ? 'Save Changes' : 'Create Quest'
                )}
            </Button>

            <div className="flex items-center gap-1.5">
                <CopyJsonButton values={formValues} />
                <LoadJsonDialog onApply={onApplyValues} />
                <EditRawDialog values={formValues} onApply={onApplyValues} />
            </div>
        </div>
    );
}
