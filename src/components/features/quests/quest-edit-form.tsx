import {QuestModel} from "@/types/quests";
import {ObjectiveFormValues, questFormSchema, QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {revalidateLogic} from "@tanstack/react-form";
import {toast} from "sonner";
import {formatDate} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {convertApiToZod} from "@/lib/quest-schema-conversion.ts";
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestObjectiveCard} from "@/components/features/quests/fields/objective.tsx";
import {CheckIcon, ClipboardTextIcon, CopyIcon, PlusIcon} from "@phosphor-icons/react";
import {Sortable, SortableContent, SortableItem} from "@/components/ui/sortable.tsx";
import {arrayMove} from "@dnd-kit/sortable";
import {useCallback, useRef, useState} from "react";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";

interface QuestEditFormProps {
    quest?: QuestModel
    onSubmit: () => void
}

function createObjective(index: number): ObjectiveFormValues {
    return {
        objective_id: index,
        order_index: index,
        description: '',
        display: '',
        logic: 'and',
        objective_type: 'kill',
        targets: [{target_uuid: crypto.randomUUID(), target_type: 'kill', count: undefined, entity: ''}],
        target_count: undefined,
        customizations: {},
        rewards: []
    }
}

type SubmitStatus = 'idle' | 'loading' | 'success';

export function QuestEditForm({quest, onSubmit}: QuestEditFormProps) {
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
    const [copied, setCopied] = useState(false);
    const loadInputRef = useRef<HTMLInputElement>(null);
    const everthornMember = useEverthornMember();

    const defaults: QuestFormValues = quest
        ? convertApiToZod(quest)
        : {
            created_by: everthornMember.thornyUser?.thorny_id,
            range: {},
            objectives: [createObjective(0)]
        } as QuestFormValues

    const form = useQuestForm({
        defaultValues: defaults,
        validationLogic: revalidateLogic({ mode: 'change' }),
        validators: {
            // @ts-ignore
            onDynamic: questFormSchema,
        },
        onSubmit: async ({ value }) => {
            setSubmitStatus('loading');

            try {
                await new Promise<void>((resolve) => {
                    onSubmit();
                    setTimeout(resolve, 800);
                });

                setSubmitStatus('success');

                if (quest) {
                    toast.success(`"${value.title}" has been successfully updated!`);
                } else {
                    toast.success(`"${value.title}" is scheduled for release on ${formatDate(value.range.start, 'PPP HH:mm')}!`);
                }

                setTimeout(() => setSubmitStatus('idle'), 2000);
            } catch {
                setSubmitStatus('idle');
            }
        }
    });

    const handleCopyJson = useCallback(() => {
        const values = form.state.values;
        const json = JSON.stringify(values, null, 2);
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [form.state.values]);

    const handleLoadJson = useCallback(() => {
        loadInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            const fieldNames = Object.keys(parsed) as (keyof QuestFormValues)[];
            for (const key of fieldNames) {
                // @ts-ignore
                form.setFieldValue(key, parsed[key]);
            }

            toast.success('Quest data loaded from JSON');
        } catch {
            toast.error('Invalid JSON file');
        }

        e.target.value = '';
    }, [form]);

    return (
        <form
            id="quest-editor"
            onSubmit={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                await form.handleSubmit()
            }}
        >
            <Card className={'p-0 gap-0 overflow-hidden'}>
                <CardContent className={'pt-3 pb-2.5 px-3 flex flex-col gap-3'}>
                    <form.AppField
                        name="title"
                        children={(field) => <field.QuestTitleField />}
                    />

                    <div className={'flex flex-wrap gap-2'}>
                        <form.AppField
                            name="quest_type"
                            children={(field) => <field.QuestTypeField/>}
                        />

                        <form.AppField
                            name="range"
                            children={(field) => <field.QuestTimeField/>}
                        />
                    </div>

                    <form.AppField
                        name="description"
                        children={(field) => <field.QuestDescriptionField/>}
                    />

                    <form.AppField
                        name="tags"
                        children={(field) => <field.QuestTagsField/>}
                    />
                </CardContent>

                <div className={'px-3 py-2'}>
                    <div className={'text-section-label flex gap-3 items-center mb-2'}>
                        Objectives <Separator className={'flex-1'} />
                    </div>

                    <form.AppField name="objectives" mode="array">
                        {(field) => (
                            <div className="flex flex-col gap-1.5">
                                <form.Subscribe
                                    selector={(state) => state.values.objectives}
                                    children={(objectives) => (
                                        <Sortable
                                            getItemValue={(item) => item.objective_id}
                                            value={objectives}
                                            onMove={({ activeIndex, overIndex }) => {
                                                const reordered = arrayMove(objectives, activeIndex, overIndex);

                                                const withUpdatedIndices = reordered.map((item, index) => ({
                                                    ...item,
                                                    order_index: index
                                                }));

                                                field.setValue(withUpdatedIndices);
                                            }}
                                        >
                                            <SortableContent className={'grid gap-1.5'}>
                                                {objectives.map((v, i) => (
                                                    <SortableItem value={v.objective_id} key={v.objective_id} asChild>
                                                        <div className={'relative group'}>
                                                            <QuestObjectiveCard
                                                                form={form}
                                                                onRemove={() => {field.removeValue(i)}}
                                                                index={i}
                                                            />
                                                        </div>
                                                    </SortableItem>
                                                ))}
                                            </SortableContent>
                                        </Sortable>
                                    )}
                                />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    className="w-fit text-muted-foreground"
                                    onClick={() => field.pushValue(createObjective(field.state.value.length))}
                                >
                                    <PlusIcon />
                                    Add Objective
                                </Button>
                            </div>
                        )}
                    </form.AppField>
                </div>

                <Separator />

                <CardFooter className={'sticky bottom-0 bg-card/95 backdrop-blur-sm px-3 py-2 flex items-center justify-between'}>
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
                                {quest ? 'Saving…' : 'Creating…'}
                            </>
                        ) : submitStatus === 'success' ? (
                            <>
                                <CheckIcon weight="bold" className="animate-in zoom-in-0 duration-200" />
                                {quest ? 'Saved' : 'Created'}
                            </>
                        ) : (
                            quest ? 'Save Changes' : 'Create Quest'
                        )}
                    </Button>

                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="text-muted-foreground gap-1.5"
                            onClick={handleCopyJson}
                        >
                            {copied ? <CheckIcon weight="bold" /> : <CopyIcon />}
                            {copied ? 'Copied' : 'Copy JSON'}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="text-muted-foreground gap-1.5"
                            onClick={handleLoadJson}
                        >
                            <ClipboardTextIcon />
                            Load JSON
                        </Button>
                        <input
                            ref={loadInputRef}
                            type="file"
                            accept=".json,application/json"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </CardFooter>
            </Card>
        </form>
    )
}
