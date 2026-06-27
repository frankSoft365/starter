import type { DeleteRequest } from '@/types/DeleteRequest';
import type { ArticleListItemVO, ArticlePublishRequest, ArticleUpdateRequest, ArticleVO } from '../types/article';
import request from "../utils/request";

export async function publishArticle(params: ArticlePublishRequest) {
    return request.post<ArticlePublishRequest, string>('/article/publish', params);
}

export async function getArticleList(params: any) {
    return request.post<any, ArticleListItemVO[]>('/article/list', params);
}

export async function getArticleById(id: string) {
    return request.get<void, ArticleVO>(`/article/${id}`);
}

export async function updateArticle(params: ArticleUpdateRequest) {
    return request.post<ArticleUpdateRequest, void>('/article/update', params);
}

export async function deleteArticle(params: DeleteRequest) {
    return request.post<DeleteRequest, void>('/article/delete', params);
}

