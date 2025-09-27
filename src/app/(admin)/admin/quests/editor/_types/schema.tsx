import { z } from "zod";
import {formatDateToAPI} from "@/lib/utils";
import {ObjectiveSchema, QuestSchema, RewardSchema} from "@/types/quest";

const formRewardSchema = z.object({
    display_name: z.string().optional(),
    reward: z.string(),
    amount: z.coerce.number(),
})

export const formObjectiveSchema = z.object({
    objective: z.string(),
    display: z.string().optional(),
    description: z.string().max(800).min(30, "The Objective Flavour should be at least 30 characters"),
    objective_count: z.coerce.number().min(1, "Must be ≥1"),
    objective_type: z.string(),
    require_natural_block: z.boolean().default(false),
    continue_on_fail: z.boolean().default(false),
    required_deaths: z.coerce.number().optional(),
    objective_timer: z.coerce.number().optional(),
    mainhand: z.string().optional(),
    location: z.tuple([z.coerce.number().nullable(), z.coerce.number().nullable()]),
    location_radius: z.coerce.number().default(100).optional(),
    rewards: z.array(formRewardSchema).optional(),
}).refine(
    (data) => data.objective_type !== "encounter" || data.display !== undefined,
    {
        message: "Custom Encounters require a Display Text",
        path: ["display"],
    }
);

export const formSchema = z.object({
    range: z.object({
        from: z.date(),
        to: z.date()
    }),
    title: z.string().min(1, 'Include a Quest Title'),
    description: z.string().max(800).min(50, "The Quest Flavour should be at least 50 characters"),
    created_by: z.coerce.number(),
    tags: z.array(z.string()),
    quest_type: z.string(),
    objectives: z.array(formObjectiveSchema).nonempty("There must be at least one objective"),
});

export function formatDataToApi(form: z.infer<typeof formSchema>): QuestSchema {
    let apiObjectives: ObjectiveSchema[] = []

    form.objectives.forEach((obj, index) => {
        let objectiveRewards: RewardSchema[] = []

        obj.rewards?.forEach((reward) => {
            objectiveRewards.push({
                balance: reward.reward === 'nugs_balance' ? reward.amount : null,
                display_name: reward.display_name ? reward.display_name : null,
                item: reward.reward !== 'nugs_balance' ? reward.reward : null,
                count: reward.amount
            })
        })

        apiObjectives.push({
            objective: obj.objective,
            display: obj.objective_type === 'encounter' && obj.display ? obj.display : null,
            order: index,
            description: obj.description,
            objective_count: obj.objective_count,
            objective_type: obj.objective_type,
            natural_block: obj.require_natural_block,
            objective_timer: obj.objective_timer ? obj.objective_timer : null,
            required_mainhand: obj.mainhand ? obj.mainhand : null,
            required_location: obj.location[0] != null && obj.location[1] != null ? obj.location as number[] : null,
            location_radius: obj.location_radius ? obj.location_radius : null,
            continue_on_fail: obj.continue_on_fail,
            required_deaths: obj.required_deaths ? obj.required_deaths : null,
            rewards: objectiveRewards ? objectiveRewards : null
        })
    })

    return {
        start_time: formatDateToAPI(form.range.from),
        end_time: formatDateToAPI(form.range.to),
        title: form.title,
        description: form.description,
        created_by: form.created_by,
        tags: form.tags,
        quest_type: form.quest_type,
        objectives: apiObjectives
    }
}

export function formatApiToData(data: QuestSchema): z.infer<typeof formSchema> {
    let formObjectives: z.infer<typeof formObjectiveSchema>[] = data.objectives.map((obj) => {
        return {
            description: obj.description,
            objective: obj.objective,
            objective_type: obj.objective_type,
            objective_count: obj.objective_count,
            display: obj.display ? obj.display : undefined,
            require_natural_block: obj.natural_block,
            objective_timer: obj.objective_timer ? obj.objective_timer : undefined,
            mainhand: obj.required_mainhand ? obj.required_mainhand : undefined,
            location: obj.required_location ? obj.required_location as [number | null, number | null] : [null, null],
            location_radius: obj.location_radius ? obj.location_radius : undefined,
            continue_on_fail: obj.continue_on_fail,
            required_deaths: obj.required_deaths ? obj.required_deaths : undefined,
            rewards: obj.rewards?.map((reward) => {
                return {
                    reward: reward.item ? reward.item : 'nugs_balance',
                    display_name: reward.display_name ? reward.display_name : undefined,
                    amount: reward.item ? reward.count : reward.balance ? reward.balance : 0,
                }
            })
        }
    })

    if (formObjectives.length === 0) {
        formObjectives.push({
            description: '',
            objective: '',
            objective_type: '',
            objective_count: 0,
            display: undefined,
            require_natural_block: false,
            objective_timer: undefined,
            mainhand: undefined,
            location: [null, null],
            location_radius: undefined,
            continue_on_fail: false,
            required_deaths: undefined,
            rewards: []
        })
    }

    return {
        range: {
            from: new Date(data.start_time),
            to: new Date(data.end_time)
        },
        title: data.title,
        description: data.description,
        created_by: data.created_by,
        tags: data.tags,
        quest_type: data.quest_type,
        objectives: formObjectives as [z.infer<typeof formObjectiveSchema>, ...z.infer<typeof formObjectiveSchema>[]]
    }
}