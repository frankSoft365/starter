import * as z from "zod";

export const CommentContentSchema = z.string()
    .trim()
    .min(1, "Comment is required")
    .max(2000, "Comment must be at most 2000 characters");

export const CreateCommentSchema = z.object({
    commentContent: CommentContentSchema,
});

export type CreateCommentForm = z.infer<typeof CreateCommentSchema>;
