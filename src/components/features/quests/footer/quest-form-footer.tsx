import {CheckIcon} from "@phosphor-icons/react";
import {Button} from "@/components/ui/button.tsx";
import {CardFooter} from "@/components/ui/card.tsx";
import {CopyJsonButton} from "@/components/features/quests/footer/copy-json-button.tsx";
import {LoadJsonDialog} from "@/components/features/quests/footer/load-json-dialog.tsx";
import {EditRawDialog} from "@/components/features/quests/footer/edit-raw-dialog.tsx";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";

export type SubmitStatus = 'idle' | 'loading' | 'success';

interface QuestFormFooterProps {
    isEditing: boolean
    submitStatus: SubmitStatus
    formValues: object
    onApplyValues: (parsed: object) => void
}

export function QuestFormFooter({isEditing, submitStatus, formValues, onApplyValues}: QuestFormFooterProps) {
    const everthornMember = useEverthornMember();

    return (
        <CardFooter className={'sticky bottom-0 bg-card/95 backdrop-blur-sm px-2 py-2 flex items-center justify-between'}>
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
                {everthornMember.isCM && (
                    <EditRawDialog values={formValues} onApply={onApplyValues} />
                )}
            </div>
        </CardFooter>
    );
}
