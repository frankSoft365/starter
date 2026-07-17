import type { TopicInArticleVO } from "./topic";

export type ArticlePublishRequest = {
    title: string;
    subtitle?: string;
    content: string;
    coverImage?: string;
    /** vertical focus point (0-1) for frontend rendering, optional */
    coverFocusY?: number;
    topics: string[];
    status: 'published' | 'scheduled';
    publishAt?: Date;
}

export type ArticleUpdateRequest = {
    articleId: string;
    content: string;
    title?: string;
    subtitle?: string;
    coverImage?: string;
    coverFocusY?: number;
}

export type ArticlePublishPreview = {
    title: string;
    subtitle: string;
    content: string;
    coverImage: string[];
}

export type ArticleListItemVO = {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    publishTime: Date;
    title: string;
    subtitle: string;
    coverImage?: string;
    /** vertical focus point returned by backend, range 0-1 (0 top, 1 bottom) */
    coverFocusY: number;
    clapNum?: number;
    responseNum?: number;
    repostNum?: number;
}

export type ArticleVO = {
    id: string;
    title: string;
    subtitle: string;
    coverImage?: string;
    coverFocusY: number;
    content: string;

    topics: TopicInArticleVO[];

    clapNum?: number;
    responseNum?: number;
    repostNum?: number;

    authorId: string;
    authorAvatar: string;
    authorName: string;
    publishTime: string;
}