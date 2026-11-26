import { z } from "zod";

const coordinatesSchema = z
    .array(z.number({ error: "Coordinates must be numbers" }).finite("Coordinates must be numbers"), {
        error: "Set the coordinates",
    })
    .length(3, "Set X, Y and Z");

export const pinDraftSchema = z.object({
    name: z.string().trim().min(1, "Give the pin a name"),
    description: z.string(),
    coordinates: coordinatesSchema,
    dimension: z.string().min(1, "Choose a dimension"),
    pin_type: z.string().min(1, "Choose a pin type"),
});

export const projectDraftSchema = z.object({
    name: z.string().trim().min(1, "Give the project a name"),
    description: z.string(),
    coordinates: coordinatesSchema,
    dimension: z.string().min(1, "Choose a dimension"),
    pin_id: z.number().int().positive().nullable(),
});

export type PinDraftValues = z.infer<typeof pinDraftSchema>;
export type ProjectDraftValues = z.infer<typeof projectDraftSchema>;
