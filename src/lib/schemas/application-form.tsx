import {z} from 'zod';

export const applicationFormSchema = z.object({
    username: z.string().optional(),
    timezone: z.string().optional(),
    age: z.coerce.number().min(1, "Please enter your age"),
    experience: z.string().min(1, "Please select your experience level"),
    playstyle: z.string().min(10, "Please tell us about your playstyle"),
    building_experience: z.string().optional(),
    redstone_experience: z.string().optional(),
    leadership_experience: z.string().optional(),
    community_values: z.string().min(20, "Please tell us what you value in a community"),
    activity: z.string().min(1, "Please select your activity level"),
    conflict_resolution: z.string().min(15, "Please share your approach to handling conflicts"),
    heard_from: z.string().optional(),
    heard_from_details: z.string().optional(),
    other: z.string().optional()
})