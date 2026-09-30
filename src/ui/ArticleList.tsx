import ArticleListItem from "@/features/home/ArticleListItem";
import type { ArticleListItemVO } from "@/types/article";
import { useTranslation } from "react-i18next";

export default function ArticleList({
  articleList,
}: {
  articleList: ArticleListItemVO[];
}) {
  const { t } = useTranslation();

  return (
    <ul className="list w-full bg-base-100">
      {articleList.length === 0 && (
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-3xl text-red-600">{t("article.list.empty")}</div>
        </main>
      )}
      {articleList.map((article) => {
        return <ArticleListItem key={article.id} article={article} />;
      })}
    </ul>
  );
}
