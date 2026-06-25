import type { ArticleListItemVO, ArticlePublishRequest, ArticleVO } from '../types/article';
import request from "../utils/request";

export async function publishArticle(params: ArticlePublishRequest) {
    return request.post<ArticlePublishRequest, void>('/article/publish', params);
}

export async function getArticleList(params: any) {
    return request.post<any, ArticleListItemVO[]>('/article/list', params);
}

export async function getOneArticle(params: any) {
    return request.post<any, ArticleVO>('/article/getOne', params);
}