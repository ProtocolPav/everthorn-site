import {ObjectiveFormValues, questFormSchema, QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {revalidateLogic} from "@tanstack/react-form";
import {toast} from "sonner";
import {formatDate} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {convertApiToZod} from "@/lib/quest-schema-conversion.ts";
import {Separator} from "@/components/ui/separator.tsx";
import {useQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestObjectiveCard} from "@/components/features/quests/fields/objective.tsx";
import {PlusIcon} from "@phosphor-icons/react";
import {Sortable, SortableContent, SortableItem} from "@/components/ui/sortable.tsx";
import {arrayMove} from "@dnd-kit/sortable";
import {useCallback, useState} from "react";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";
import {QuestFormFooter, SubmitStatus} from "@/components/features/quests/footer/quest-form-footer.tsx";
import {useNavigate} from "@tanstack/react-router";
import {QuestOut} from "@/api/nexuscore/model";

interface QuestEditFormProps {
    quest?: QuestOut
    onSubmit: (value: QuestFormValues) => Promise<void>
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
        target_count: 0,
        customizations: {},
        rewards: []
    }
}

export function QuestEditForm({quest, onSubmit}: QuestEditFormProps) {
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
    const everthornMember = useEverthornMember();
    const navigate = useNavigate();

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
                    onSubmit(value);
                    setTimeout(resolve, 800);
                });

                setSubmitStatus('success');

                if (quest) {
                    toast.success(`"${value.title}" has been updated. Changes take up to 5 minutes to propagate in-game.`);
                } else {
                    toast.success(`"${value.title}" is scheduled for release on ${formatDate(value.range.start, 'PPP HH:mm')}!`);
                    await navigate({to: '/admin/quests'})
                }

                setTimeout(() => setSubmitStatus('idle'), 2000);
            } catch {
                setSubmitStatus('idle');
            }
        }
    });

    const applyParsedJson = useCallback((parsed: object) => {
        const fieldNames = Object.keys(parsed) as (keyof QuestFormValues)[];
        for (const key of fieldNames) {
            // @ts-ignore
            form.setFieldValue(key, parsed[key]);
        }
    }, [form]);

    return (
        <form
            id="quest-editor"
            className={'flex flex-col'}
            onSubmit={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                await form.handleSubmit()
            }}
        >
            <div className={'flex flex-col gap-3 pb-3'}>
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

                <div>
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
            </div>

            <form.Subscribe
                selector={(state) => state.values}
                children={(values) => (
                    <QuestFormFooter
                        isEditing={!!quest}
                        submitStatus={submitStatus}
                        formValues={values}
                        onApplyValues={applyParsedJson}
                    />
                )}
            />
        </form>
    )
}
