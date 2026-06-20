import type { ArticlePublishRequest } from '../types/article';
import request from "../utils/request";

export async function publishArticle(params: ArticlePublishRequest) {
    return request.post<ArticlePublishRequest, void>('/article/publish', params);
}