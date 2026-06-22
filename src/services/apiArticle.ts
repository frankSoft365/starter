import type { ArticleListItemVO, ArticlePublishRequest } from '../types/article';
import request from "../utils/request";

export async function publishArticle(params: ArticlePublishRequest) {
    return request.post<ArticlePublishRequest, void>('/article/publish', params);
}

export async function getArticleList(params: any) {
    return request.post<any, ArticleListItemVO[]>('/article/list', params);
}