import { useQuery } from "@tanstack/react-query";
import { getArticleCollectStatus, isArticleCollected } from "@/services/apiCollection";

/**
 * 查询文章在用户各收藏列表中的收藏状态。
 * enabled 控制是否在点击收藏按钮时才发起请求。
 */
export function useArticleCollectStatusQuery(articleId: string, enabled: boolean) {
    return useQuery({
        queryKey: ['article-collect-status', articleId],
        queryFn: () => getArticleCollectStatus(articleId),
        enabled,
    });
}

/**
 * 查询文章是否已被当前用户收藏（任意列表中）。
 * 挂载即请求，pending 时用于禁用收藏按钮。
 */
export function useIsArticleCollectedQuery(articleId: string) {
    return useQuery({
        queryKey: ['article-collected', articleId],
        queryFn: () => isArticleCollected(articleId),
    });
}
