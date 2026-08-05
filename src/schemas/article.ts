import * as z from "zod";

const TitleSchema = z.string()
    .min(1, "article.validate.titleRequired")
    .max(100, "article.validate.titleMax");

const SubtitleSchema = z.string()
    .max(140, "article.validate.subtitleMax");

export const TopicCandidateSchema = z.string()
    .trim()
    .regex(/^[\p{L}0-9\s-]*$/u, "article.validate.topicRegex")
    .max(25, "article.validate.topicMax");

const TopicSchema = z.array(TopicCandidateSchema);

export const ArticleSubmissionSchema = z.object({
    coverImage: z.string().optional(),
    coverFocusY: z.number()
        .min(0, "article.validate.coverFocusYMin")
        .max(1, "article.validate.coverFocusYMax")
        .optional(),
    title: TitleSchema,
    subtitle: SubtitleSchema.optional(),
    topics: TopicSchema,
    topicCandidate: TopicCandidateSchema.optional(),
});

export type ArticleSubmissionForm = z.infer<typeof ArticleSubmissionSchema>;
