import Avatar from "@/ui/Avatar";
import ArticlePreviewImage from "../home/ArticlePreviewImage";
import { getPublishDate } from "@/utils/dateHelper";
import type { ArticleListItemVO, ArticleVO } from "@/types/article";

export default function RepostArticlePreview({
  article,
}: {
  article: ArticleVO | ArticleListItemVO;
}) {
  return (
    <div className="mt-2 p-4 grid grid-cols-2 md:grid-cols-7 gap-2 border border-base-300 rounded-box">
      {/* cover image */}
      <div className="col-span-1 md:col-span-2">
        {article.coverImage ? (
          <ArticlePreviewImage
            url={article.coverImage}
            coverFocusY={article.coverFocusY}
          />
        ) : (
          <div className="w-full aspect-3/2 bg-base-300"></div>
        )}
      </div>
      {/* title subtitle and author info */}
      <div className="col-span-1 md:col-span-5 flex min-w-0 flex-col gap-2">
        <h1 className="font-bold text-md md:text-lg truncate whitespace-nowrap overflow-hidden text-ellipsis">
          {article.title}
        </h1>
        <h3 className="text-sm text-base-content/70 truncate whitespace-nowrap overflow-hidden text-ellipsis">
          {article.subtitle}
        </h3>
        <div className="flex min-w-0 items-center gap-1">
          <Avatar
            imageUrl={article.authorAvatar}
            username={article.authorName}
            size="xxs"
          />
          <div className="flex min-w-0 items-center text-xs md:text-sm text-base-content/60">
            <span className="min-w-0 flex-1 truncate">
              {article.authorName}
            </span>
            <span className="mx-1 shrink-0">·</span>
            <span className="shrink-0 whitespace-nowrap">
              {getPublishDate(new Date(article.publishTime))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
