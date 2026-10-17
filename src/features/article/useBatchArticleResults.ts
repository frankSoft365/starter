import { useQueries } from "@tanstack/react-query";
import type {
  ArticleResult,
  OperationList,
  OperationResult,
} from "@/types/article";
import { batchOperationRequest } from "@/services/apiArticle";

function selectArticleResults(results: OperationResult[]) {
  const resultsByArticleId = new Map<string, ArticleResult>();

  for (const result of results) {
    if (!result.articleResult) {
      continue;
    }
    const articleResult = result.articleResult;
    const previous = resultsByArticleId.get(articleResult.id);
    resultsByArticleId.set(articleResult.id, {
      id: articleResult.id,
      repostCount: articleResult.repostCount ?? previous?.repostCount,
      viewerEdge: articleResult.viewerEdge ?? previous?.viewerEdge,
    });
  }

  return resultsByArticleId;
}

export function useBatchArticleResults(articleIdBatches: string[][]) {
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
          { operationName: "RepostCountQuery", id: articleId },
          { operationName: "CollectionBaseQuery", id: articleId },
        ],
      );

      return {
        queryKey: ["batch-query-count-or-viewer-edge", articleIds],
        queryFn: () => batchOperationRequest({ params: { operationList } }),
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
