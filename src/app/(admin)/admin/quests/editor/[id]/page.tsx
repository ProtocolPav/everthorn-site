"use client"
import * as React from "react";
import {Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {formSchema, formatApiToData, formatDataToApi} from "../_types/schema"
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form} from "@/components/ui/form";
import {QuestTitle} from "../_components/title"
import {QuestDescription} from "@/app/(admin)/admin/quests/editor/_components/description";
import {QuestDates} from "@/app/(admin)/admin/quests/editor/_components/dates";
import {Tags} from "@/app/(admin)/admin/quests/editor/_components/tags";
import {Separator} from "@/components/ui/separator";
import {QuestObjectives} from "@/app/(admin)/admin/quests/editor/_components/objectives";
import { toast } from 'sonner';
import {LoadJSON} from "@/app/(admin)/admin/quests/editor/_components/load_json";
import {useParams} from "next/navigation";
import {useQuest} from "@/hooks/use-quest";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useSession} from "next-auth/react";
import {Info, XCircle} from "@phosphor-icons/react";
import {QuestType} from "@/app/(admin)/admin/quests/editor/_components/type";

export default function QuestsCreator() {
    const params = useParams<{ id: string }>()
    const [submitted, setSubmitted] = React.useState(params.id !== 'new');
    const { quest, isLoading, isError } = useQuest(params.id);
    const { data: session, status } = useSession()

    const form = useForm<z.infer<typeof formSchema>>({
        mode: "onChange",
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            created_by: Number(session?.user?.everthornMemberInfo.thorny_id)
        }
    })

    React.useEffect(() => {
        if (quest) {
            const data = formatApiToData(quest)
            form.setValue('title', data.title);
            form.setValue('description', data.description);
            form.setValue('created_by', data.created_by);
            form.setValue('tags', data.tags);
            form.setValue('quest_type', data.quest_type);
            form.setValue('range', data.range);
            form.setValue('objectives', data.objectives);
        }
    }, [quest, form]);

    async function onSubmit(form: z.infer<typeof formSchema>): Promise<void> {
        let apiReadyData = formatDataToApi(form)

        const questResponse = await fetch("/nexuscore-api/v0.2/quests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiReadyData),
        })

        if (questResponse.ok) {
            setSubmitted(true)
            toast.success("The quest has been submitted. Go advertise it!")
        } else {
            toast.error("Something went wrong", {
                description: `${questResponse.status}: ${questResponse.statusText}`})
        }
    }

    async function onCopy(form: z.infer<typeof formSchema>) {
        let apiReadyData = formatDataToApi(form)
        await navigator.clipboard.writeText(JSON.stringify(apiReadyData, null, 2))

        toast.info('Copied to clipboard!')
    }

    if (isLoading) {
        return (
            <div>Loading Quest Data...</div>
        )
    }

    return (
        <section className="grid items-center gap-6 pb-8">
            {submitted &&
                <Alert variant={'info'} className={'md:w-4/5'}>
                    <Info weight={'duotone'} className="size-4" />
                    <AlertDescription>
                        <div className="font-semibold mb-2">Read-Only Mode</div>
                        You're viewing a previously published quest. You can't save your edits just yet, but keep
                        an eye out for that functionality in the future!
                    </AlertDescription>
                </Alert>
            }

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className={'bg-gray-500/5 shadow-xl backdrop-blur-sm md:w-4/5 p-0'}>
                        <CardContent className={'p-3'}>
                            <QuestTitle form={form} disable={submitted} />
                            <QuestType form={form} disable={submitted} />
                            <QuestDescription
                                form={form}
                                field_name={'description'}
                                placeholder={'A flavourful quest hook! Get people wishing they could do this quest!'}
                                disable={submitted}
                            />
                            <QuestDates form={form} disable={submitted} />
                            <Tags form={form} disable={submitted} />
                            <Separator/>
                            <QuestObjectives form={form} disable={submitted} />
                        </CardContent>

                        <CardFooter className={'flex justify-between gap-3 p-3'}>
                            <Button variant={'secondary'} type={'submit'} disabled={submitted}>
                                Submit
                            </Button>

                            <div className={'flex gap-3'}>
                                <LoadJSON form={form}/>

                                <Button variant={'ghost'} type={'button'} onClick={async () => onCopy(form.getValues())}>
                                    Copy JSON
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </section>
    )
}