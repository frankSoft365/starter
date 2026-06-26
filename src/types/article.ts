export type ArticlePublishRequest = {
    title: string;
    subtitle?: string;
    content: string;
    coverImage?: string;
    topics: string[];
    status: 'published' | 'scheduled';
    publishAt?: Date;
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
    clapNum?: number;
    responseNum?: number;
    repostNum?: number;
}

export type ArticleVO = {
    id: string;
    title: string;
    subtitle: string;
    coverImage: string;
    content: string;

    clapNum?: number;
    responseNum?: number;
    repostNum?: number;

    authorId: string;
    authorAvatar: string;
    authorName: string;
    publishTime: string;
}