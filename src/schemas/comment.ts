import * as z from "zod";

export const CommentContentSchema = z.string()
    .trim()
    .min(1, "comment.validate.commentRequired")
    .max(2000, "comment.validate.commentMax");

export const CreateCommentSchema = z.object({
    commentContent: CommentContentSchema,
});

export type CreateCommentForm = z.infer<typeof CreateCommentSchema>;
