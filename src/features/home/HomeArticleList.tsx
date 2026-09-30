import { useQuery } from "@tanstack/react-query";
import { getArticleList } from "@/services/apiArticle";
import { useTranslation } from "react-i18next";
import ArticleList from "@/ui/ArticleList";
import ArticleListSkeleton from "./ArticleListItemSkeleton";

export default function HomeArticleList() {
  const { t } = useTranslation();

  const {
    data: articleList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["get-home-article-list"],
    queryFn: async () => {
      return await getArticleList({ isMyArticle: false });
    },
  });

  return (
    <>
      {/* loading skeleton */}
      {isLoading && !isError && <ArticleListSkeleton />}
      {isError && (
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-3xl text-red-600">
            {error.message || t("article.list.loadFailed")}
          </div>
        </main>
      )}

      {!isLoading && !isError && articleList && (
        <ArticleList articleList={articleList} />
      )}
    </>
  );
}
