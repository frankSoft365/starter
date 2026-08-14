import * as z from "zod";

export const CreateCollectionListSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'profile.list.nameRequired')
        .max(60, 'profile.list.nameMaxLength'),
    description: z
        .string()
        .trim()
        .max(280, 'profile.list.descriptionMaxLength'),
    isPublic: z.number().int().min(0).max(1),
});

export type CreateCollectionListForm = {
    name: string;
    description: string;
    isPublic: number;
};
