import * as z from "zod";

const TitleSchema = z.string()
    .min(1, "Please enter a title")
    .max(100, "The title cannot exceed 100 characters.");

const SubtitleSchema = z.string()
    .max(140, "The subtitle cannot exceed 140 characters.");

export const TopicCandidateSchema = z.string()
    .trim()
    .regex(/^[\p{L}0-9\s-]*$/u, "Tags only support letters, numbers, spaces and dashes.")
    .max(25, "A tag name must be 25 characters max.");

const TopicSchema = z.array(TopicCandidateSchema);

export const ArticleSubmissionSchema = z.object({
    coverImage: z.string().optional(),
    title: TitleSchema,
    subtitle: SubtitleSchema.optional(),
    topics: TopicSchema,
    topicCandidate: TopicCandidateSchema.optional(),
});

export type ArticleSubmissionForm = z.infer<typeof ArticleSubmissionSchema>;
