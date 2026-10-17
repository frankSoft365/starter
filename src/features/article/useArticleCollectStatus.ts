import { useQuery } from "@tanstack/react-query";
import { getArticleCollectStatus } from "@/services/apiCollection";

/**
 * 查询文章在用户各收藏列表中的收藏状态。
 * enabled 控制是否在点击收藏按钮时才发起请求。
 */
export function useArticleCollectStatusQuery(
  articleId: string,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["article-collect-status", articleId],
    queryFn: () => getArticleCollectStatus(articleId),
    enabled,
  });
}
