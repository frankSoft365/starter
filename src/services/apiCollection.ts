import request from "../utils/request";
import type { ArticleCollectStatusVO, CollectionListDetailVO, CollectionListVO } from "@/types/collection";
import type { ArticleListItemVO } from "@/types/article";

export async function getUserCollectionLists(userId: string) {
    return request.get<void, CollectionListVO[]>('/collection/user/lists', { params: { userId } });
}

export async function getCollectionList(listId: string) {
    return request.get<void, CollectionListDetailVO>(`/collection/user/list/${listId}`);
}

export async function getCollectionListArticles(listId: string) {
    return request.get<void, ArticleListItemVO[]>(`/collection/user/list/${listId}/articles`);
}

export async function getArticleCollectStatus(articleId: string) {
    return request.get<void, ArticleCollectStatusVO[]>('/collection/user/article/status', {
        params: { articleId },
    });
}

export async function isArticleCollected(articleId: string) {
    return request.get<void, boolean>('/collection/user/article/collected', {
        params: { articleId },
    });
}

export async function addArticleToList(articleId: string, listId?: string) {
    return request.post<{ articleId: string; listId?: string }, void>('/collection/user/article/add', { articleId, listId });
}

export async function removeArticleFromList(articleId: string, listId: string) {
    return request.post<{ articleId: string; listId: string }, void>('/collection/user/article/remove', { articleId, listId });
}

export async function removeArticlesFromList(listId: string, articleIds: string[]) {
    return request.post<{ listId: string; articleIds: string[] }, void>('/collection/user/article/remove/batch', { listId, articleIds });
}

export async function createCollectionList(data: { name: string; description?: string; isPublic: number }) {
    return request.post<typeof data, string>('/collection/user/list/create', data);
}

export async function updateCollectionList(data: { listId: string; name?: string; description?: string; isPublic?: number }) {
    return request.post<typeof data, void>('/collection/user/list/update', data);
}

export async function toggleListPublic(listId: string) {
    return request.post<{ listId: string }, void>('/collection/user/list/public', { listId });
}

export async function deleteCollectionList(listId: string) {
    return request.post<void, void>(`/collection/user/list/${listId}/delete`);
}
