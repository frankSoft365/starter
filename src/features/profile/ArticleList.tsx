import ArticleListItem from "@/features/home/ArticleListItem";
import type { ArticleListItemVO } from "@/types/article";
import { BookOpenIcon } from "@phosphor-icons/react";
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
        <main className="flex items-center justify-center min-h-[calc(100dvh-8rem)]">
          <div className="flex flex-col items-center">
            <BookOpenIcon size={32} />
            <div className="text-xl md:text-2xl text-base-content/70">
              {t("article.list.empty")}
            </div>
          </div>
        </main>
      )}
      {articleList.map((article, index) => {
        return (
          <ArticleListItem index={index} key={article.id} article={article} />
        );
      })}
    </ul>
  );
}
