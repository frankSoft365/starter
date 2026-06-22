export type ArticlePublishRequest = {
    title: string;
    subtitle: string;
    content: string;
    coverImage: string;
    topic?: string[];
}

export type ArticlePublishPreview = {
    title: string;
    subtitle: string;
    content: string;
    coverImage: string[];
}

export type ArticleListItemVO = {
    authorName: string;
    authorAvatar: string;
    publishTime: Date;
    title: string;
    subtitle: string;
    coverImage: string;
    clapNum: number;
    responseNum: number;
    repostNum: number;
}