export type TopicNameRequest = {
    name: string;
}

export type TopicSuggestionVO = {
    name: string;
    articlesCount: string;
    status: 'new' | 'existing';
}

export type TopicInArticleVO = {
    id: string;
    name: string;
    slug: string;
}