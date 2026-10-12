import { useQueries } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import { batchQueryCountOrViewerEdge } from "@/services/apiArticle";
import type { ArticleResult, OperationList } from "@/types/article";

function selectArticleResults(results: ArticleResult[]) {
  const resultsByArticleId = new Map<string, ArticleResult>();

  for (const result of results) {
    const previous = resultsByArticleId.get(result.id);
    resultsByArticleId.set(result.id, {
      id: result.id,
      repostCount: result.repostCount ?? previous?.repostCount,
      viewerEdge: result.viewerEdge ?? previous?.viewerEdge,
    });
  }

  return resultsByArticleId;
}

export function useBatchArticleResults(articleIdBatches: string[][]) {
  const user = useAtomValue(userAtom);
  const seenArticleIds = new Set<string>();
  const uniqueArticleIdBatches = articleIdBatches
    .map((batch) =>
      batch.filter((articleId) => {
        if (!articleId || seenArticleIds.has(articleId)) {
          return false;
        }
        seenArticleIds.add(articleId);
        return true;
      }),
    )
    .filter((batch) => batch.length > 0);

  const articleResultQueries = useQueries({
    queries: uniqueArticleIdBatches.map((articleIds) => {
      const operationList: OperationList["operationList"] = articleIds.flatMap(
        (articleId) => [
          { operationName: "RepostCountQuery", articleId },
          { operationName: "CollectionBaseQuery", articleId },
        ],
      );

      return {
        queryKey: [
          "batch-query-count-or-viewer-edge",
          user?.id ?? "anonymous",
          articleIds,
        ],
        queryFn: () =>
          batchQueryCountOrViewerEdge({ params: { operationList } }),
        select: selectArticleResults,
        enabled: operationList.length > 0,
      };
    }),
  });

  const articleResultsById = new Map<string, ArticleResult>();
  const articleResultStatusById = new Map<
    string,
    "error" | "success" | "pending"
  >();

  articleResultQueries.forEach((query, index) => {
    query.data?.forEach((result, articleId) => {
      articleResultsById.set(articleId, result);
    });

    const queryStatus = query.isPending
      ? "pending"
      : query.isError
        ? "error"
        : "success";
    uniqueArticleIdBatches[index].forEach((articleId) => {
      articleResultStatusById.set(articleId, queryStatus);
    });
  });

  return { articleResultsById, articleResultStatusById };
}
