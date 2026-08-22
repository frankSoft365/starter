import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addArticleToList, createCollectionList, deleteCollectionList, getCollectionList, getCollectionListArticles, getUserCollectionLists, removeArticleFromList, removeArticlesFromList, toggleListPublic, updateCollectionList } from "@/services/apiCollection";
import type { CollectionListDetailVO } from "@/types/collection";
import type { CreateCollectionListForm } from "@/schemas/collection";

export function useCollectionListsQuery(userId: string) {
    return useQuery({
        queryKey: ['collection-lists', userId],
        queryFn: () => getUserCollectionLists(userId),
    });
}

export function useCollectionListQuery(listId: string | undefined) {
    return useQuery<CollectionListDetailVO>({
        queryKey: ['collection-list', listId],
        queryFn: () => getCollectionList(listId!),
        enabled: !!listId,
    });
}

export function useCollectionListArticlesQuery(listId: string) {
    return useQuery({
        queryKey: ['collection-list-articles', listId],
        queryFn: () => getCollectionListArticles(listId),
        enabled: !!listId,
    });
}

export function useCreateCollectionList(articleId?: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateCollectionListForm) => {
            const listId = await createCollectionList(data);
            if (articleId) {
                await addArticleToList(articleId, listId);
            }
            return listId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collection-lists'] });
            if (articleId) {
                // 用 remove 而非 invalidate：modal 关闭时 popover 无 active observer，
                // invalidate 只标记 stale 不删除数据，下次打开会先闪现旧 statusList。
                // remove 彻底删除缓存，下次打开走正常 loading 流程。
                queryClient.removeQueries({ queryKey: ['article-collect-status', articleId] });
                queryClient.invalidateQueries({ queryKey: ['article-collected', articleId] });
            }
        },
    });
}

export function useAddArticleToDefaultList(articleId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => addArticleToList(articleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['article-collected', articleId] });
        },
    });
}

/**
 * 添加文章到指定列表（checkbox 勾选用）。成功后刷新收藏状态、是否已收藏、列表文章数缓存。
 */
export function useAddArticleToList() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ articleId, listId }: { articleId: string; listId: string }) => addArticleToList(articleId, listId),
        onSuccess: (_data, { articleId }) => {
            queryClient.invalidateQueries({ queryKey: ['article-collect-status', articleId] });
            queryClient.invalidateQueries({ queryKey: ['article-collected', articleId] });
            queryClient.invalidateQueries({ queryKey: ['collection-list-articles'] });
            queryClient.invalidateQueries({ queryKey: ['collection-list'] });
            queryClient.invalidateQueries({ queryKey: ['collection-lists'] });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
}

/**
 * 从指定列表中取消收藏文章。成功后刷新收藏状态、是否已收藏、列表文章数缓存。
 */
export function useRemoveArticleFromList() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ articleId, listId }: { articleId: string; listId: string }) => removeArticleFromList(articleId, listId),
        onSuccess: (_data, { articleId }) => {
            queryClient.invalidateQueries({ queryKey: ['article-collect-status', articleId] });
            queryClient.invalidateQueries({ queryKey: ['article-collected', articleId] });
            queryClient.invalidateQueries({ queryKey: ['collection-list-articles'] });
            queryClient.invalidateQueries({ queryKey: ['collection-list'] });
            queryClient.invalidateQueries({ queryKey: ['collection-lists'] });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
}

/**
 * 批量从指定列表中取消收藏文章。成功后刷新列表文章、列表信息、列表页缓存。
 */
export function useRemoveArticlesFromList() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ listId, articleIds }: { listId: string; articleIds: string[] }) => removeArticlesFromList(listId, articleIds),
        onSuccess: (_data, { articleIds }) => {
            articleIds.forEach((articleId) => {
                queryClient.invalidateQueries({ queryKey: ['article-collect-status', articleId] });
                queryClient.invalidateQueries({ queryKey: ['article-collected', articleId] });
            });
            queryClient.invalidateQueries({ queryKey: ['collection-list-articles'] });
            queryClient.invalidateQueries({ queryKey: ['collection-list'] });
            queryClient.invalidateQueries({ queryKey: ['collection-lists'] });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
}

/**
 * 切换列表公开/私有状态。后端取反，前端只传 listId。
 */
export function useToggleListPublic(listId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => toggleListPublic(listId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collection-lists'] });
            queryClient.invalidateQueries({ queryKey: ['collection-list', listId] });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
}

/**
 * 删除自定义收藏列表。成功后失效列表页缓存。
 */
export function useDeleteCollectionList() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (listId: string) => deleteCollectionList(listId),
        onSuccess: (_data, listId) => {
            queryClient.invalidateQueries({ queryKey: ['collection-lists'] });
            queryClient.removeQueries({ queryKey: ['collection-list', listId] });
            queryClient.removeQueries({ queryKey: ['collection-list-articles', listId] });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
}

/**
 * 更新列表信息。字段可选，未修改不传。成功后失效列表页 + 详情页缓存。
 */
export function useUpdateCollectionList(listId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { listId: string; name?: string; description?: string; isPublic?: number }) => updateCollectionList(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collection-lists'] });
            queryClient.invalidateQueries({ queryKey: ['collection-list', listId] });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
}
