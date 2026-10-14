import {
  ArrowsClockwiseIcon,
  BookmarkIcon,
  ChatCircleDotsIcon,
  HandsClappingIcon,
  ThumbsDownIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { ArticleListItemType } from "@/types/article";
import { useTranslation } from "react-i18next";
import { formatLargeNumber } from "@/utils/number";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import MoreButton from "../article/MoreButton";
import SaveButton from "../article/SaveButton";
import ArticleAuthorInfo from "@/ui/ArticleAuthorInfo";
import SignedIn from "@/ui/utils/SignedIn";
import SignedOut from "@/ui/utils/SignedOut";
import ArticlePreviewImage from "../../ui/article/ArticlePreviewImage";
import useOverflowHelper from "@/utils/overflowHelper";
import {
  useLocation,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useState } from "react";
import { Route as articleDetailRoute } from "@/routes/_app/article.$articleId";
import { isDeletedArticle } from "../collection/CollectionListDetail";
import { Route as readingHistoryRoute } from "@/routes/_app/_protected/me/lists/reading-history";
import { useDeleteHistoryItem } from "../readingHistory/readingHistory";
import { Route as activityRoute } from "@/routes/_app/_protected/profile/$userId/_profile/activity";

export default function ArticleListItem({
  index,
  article,
  onRemoveFromList,
  articleResultStatus,
  activityInfo,
}: {
  index?: number;
  article: ArticleListItemType;
  onRemoveFromList?: () => void;
  articleResultStatus?: "error" | "success" | "pending";
  activityInfo?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const { handleOverflow } = useOverflowHelper();
  const [isRemovingFromHistory, setIsRemovingFromHistory] = useState(false);

  // derived state for rendering of
  // trash button (remove from reading history button)
  const isReadingHistoryRoute = location.pathname === readingHistoryRoute.to;
  // at profile activity path unlike button will not render
  const isActivityPath = useRouterState({
    select: (state) =>
      state.matches.some((match) => match.routeId === activityRoute.id),
  });

  const { handleDelete, isDeleting } = useDeleteHistoryItem();

  if (isDeletedArticle(article)) {
    return (
      <li className="list-row grid-cols-1">
        <div className="col-span-1">
          {isActivityPath && activityInfo}
          <div className="collapse w-full collapse-arrow mt-2 bg-base-200">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title font-semibold text-base-content/70">
              Unavailable article
            </div>
            <div className="collapse-content text-sm text-base-content/60">
              This article was deleted by the author or banned.
            </div>
          </div>
        </div>
        <div></div>
      </li>
    );
  }

  const isOwnStory = user ? article.creator.id === user.id : false;

  return (
    <div
      onClick={() => {
        navigate({
          to: articleDetailRoute.to,
          params: { articleId: article.id },
        });
      }}
    >
      <li
        id={index !== undefined ? "article-list-item-0" : undefined}
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === "opacity" &&
            isRemovingFromHistory
          ) {
            handleDelete(
              { articleId: article.id },
              { onError: () => setIsRemovingFromHistory(false) },
            );
          }
        }}
        className={`list-row min-h-56 cursor-pointer grid-cols-5 md:grid-cols-7 transition-opacity duration-500 ${isRemovingFromHistory ? "opacity-0" : "opacity-100"}`}
      >
        {article.previewImage.url ? (
          <>
            <div className="flex flex-col gap-1 justify-between col-span-3 md:col-span-5">
              {/* activity user info */}
              {isActivityPath && activityInfo}
              {/* user info */}
              {!isActivityPath && (
                <ArticleAuthorInfo
                  authorId={article.creator.id}
                  authorAvatar={article.creator.avatar ?? ""}
                  authorName={article.creator.username}
                  publishTime={article.publishAt}
                  className="text-xs md:text-sm"
                />
              )}
              {/* article content */}
              <div>
                <p className="text-lg/tight md:text-2xl/tight font-sans font-bold text-wrap mt-1 mb-2.5">
                  {article.title}
                </p>
                {/* subtitle */}
                {!article.extendedPreviewContent.isFullContent && (
                  <p className="text-sm/tight md:text-base/tight text-base-content/70 font-sans font-light text-wrap">
                    {handleOverflow(
                      article.extendedPreviewContent.subtitle,
                      118,
                    )}
                  </p>
                )}
              </div>
              {/* user info */}
              {isActivityPath && (
                <ArticleAuthorInfo
                  authorId={article.creator.id}
                  authorAvatar={article.creator.avatar ?? ""}
                  authorName={article.creator.username}
                  publishTime={article.publishAt}
                  className="text-xs md:text-sm"
                />
              )}
              {/* actions */}
              <div className="flex py-1 flex-col md:flex-row justify-between md:items-center [&_svg]:text-base-content/70">
                {/* left part read-only count */}
                {articleResultStatus === "pending" && (
                  <div className="skeleton h-4 w-20 rounded-none"></div>
                )}
                {articleResultStatus === "success" && (
                  <div className="flex flex-row gap-3">
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.clap", { count: article.clapCount })}
                    >
                      <span className="inline-flex items-center gap-0.5 text-sm font-light">
                        <HandsClappingIcon size={20} />
                        {formatLargeNumber(article.clapCount)}
                      </span>
                    </div>
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.response", {
                        count: article.responseCount,
                      })}
                    >
                      <span className="inline-flex items-center gap-0.5 text-sm font-light">
                        <ChatCircleDotsIcon weight="duotone" size={20} />
                        {article.responseCount}
                      </span>
                    </div>
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.repostCount", {
                        count: article.repostCount ?? 0,
                      })}
                    >
                      <span className="inline-flex items-center gap-0.5 text-sm font-light">
                        <ArrowsClockwiseIcon size={20} />
                        {formatLargeNumber(article.repostCount ?? 0)}
                      </span>
                    </div>
                  </div>
                )}
                {/* right part actions */}
                <div className="flex flex-row justify-start gap-1">
                  {/* remove from reading history button */}
                  {isReadingHistoryRoute && (
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.removeFromReadingHistory")}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRemovingFromHistory(true);
                        }}
                        disabled={isDeleting || isRemovingFromHistory}
                        className="btn btn-square btn-ghost"
                      >
                        <TrashIcon size={24} weight="light" />
                      </button>
                    </div>
                  )}
                  {!isActivityPath && (
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.notInterested")}
                    >
                      <button className="btn btn-square btn-ghost">
                        <ThumbsDownIcon size={24} weight="light" />
                      </button>
                    </div>
                  )}
                  {/* save button */}
                  <SignedIn>
                    {articleResultStatus === "pending" && (
                      <button
                        type="button"
                        className="btn btn-square btn-ghost opacity-60"
                        disabled={true}
                      >
                        <BookmarkIcon size={24} />
                      </button>
                    )}
                    {articleResultStatus === "success" && (
                      <SaveButton
                        articleId={article.id}
                        initialIsCollected={article.isCollected ?? false}
                      />
                    )}
                  </SignedIn>
                  <SignedOut>
                    <div className="lg:tooltip" data-tip={t("btn.favorite")}>
                      <button
                        type="button"
                        className="btn btn-square btn-ghost"
                        disabled
                      >
                        <BookmarkIcon size={24} weight="light" />
                      </button>
                    </div>
                  </SignedOut>
                  {/* more button */}
                  <MoreButton
                    isOwnStory={isOwnStory}
                    authorId={article.creator.id}
                    articleId={article.id}
                    onRemoveFromReadingHistory={() =>
                      setIsRemovingFromHistory(true)
                    }
                    onRemoveFromList={onRemoveFromList}
                  />
                </div>
              </div>
            </div>
            <div className="content-center col-start-4 col-end-6 md:col-start-6 md:col-end-8">
              <ArticlePreviewImage imageMetaData={article.previewImage} />
            </div>
          </>
        ) : (
          <div className="col-span-5 md:col-span-7 grid grid-cols-5 md:grid-cols-7 gap-x-4">
            <div className="flex flex-col gap-1 justify-between col-span-3 md:col-span-5">
              {/* activity user info */}
              {isActivityPath && activityInfo}
              {/* user info */}
              {!isActivityPath && (
                <ArticleAuthorInfo
                  authorId={article.creator.id}
                  authorAvatar={article.creator.avatar ?? ""}
                  authorName={article.creator.username}
                  publishTime={article.publishAt}
                  className="text-xs md:text-sm"
                />
              )}
            </div>
            {/* article content */}
            <div className="flex flex-col justify-around col-span-5 md:col-span-7">
              <p className="text-lg/tight md:text-2xl/tight font-sans font-bold text-wrap mt-1 mb-2.5">
                {article.title}
              </p>
              {/* subtitle */}
              {!article.extendedPreviewContent.isFullContent && (
                <p className="text-sm/tight md:text-base/tight text-base-content/70 font-sans font-light text-wrap">
                  {handleOverflow(article.extendedPreviewContent.subtitle, 118)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 justify-between col-span-3 md:col-span-5">
              {/* user info */}
              {isActivityPath && (
                <ArticleAuthorInfo
                  authorId={article.creator.id}
                  authorAvatar={article.creator.avatar ?? ""}
                  authorName={article.creator.username}
                  publishTime={article.publishAt}
                  className="text-xs md:text-sm"
                />
              )}
              {/* actions */}
              <div className="flex py-1 flex-col md:flex-row justify-between md:items-center [&_svg]:text-base-content/70">
                {/* left part read-only count */}
                {articleResultStatus === "pending" && (
                  <div className="skeleton h-4 w-20 rounded-none"></div>
                )}
                {articleResultStatus === "success" && (
                  <div className="flex flex-row gap-3">
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.clap", { count: article.clapCount })}
                    >
                      <span className="inline-flex items-center gap-0.5 text-sm font-light">
                        <HandsClappingIcon size={20} />
                        {formatLargeNumber(article.clapCount)}
                      </span>
                    </div>
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.response", {
                        count: article.responseCount,
                      })}
                    >
                      <span className="inline-flex items-center gap-0.5 text-sm font-light">
                        <ChatCircleDotsIcon weight="duotone" size={20} />
                        {article.responseCount}
                      </span>
                    </div>
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.repostCount", {
                        count: article.repostCount ?? 0,
                      })}
                    >
                      <span className="inline-flex items-center gap-0.5 text-sm font-light">
                        <ArrowsClockwiseIcon size={20} />
                        {formatLargeNumber(article.repostCount ?? 9999)}
                      </span>
                    </div>
                  </div>
                )}
                {/* right part actions */}
                <div className="flex flex-row justify-start gap-1">
                  {/* remove from reading history button */}
                  {isReadingHistoryRoute && (
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.removeFromReadingHistory")}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsRemovingFromHistory(true);
                        }}
                        disabled={isDeleting || isRemovingFromHistory}
                        className="btn btn-square btn-ghost"
                      >
                        <TrashIcon size={24} weight="light" />
                      </button>
                    </div>
                  )}
                  {!isActivityPath && (
                    <div
                      className="lg:tooltip"
                      data-tip={t("btn.notInterested")}
                    >
                      <button className="btn btn-square btn-ghost">
                        <ThumbsDownIcon size={24} weight="light" />
                      </button>
                    </div>
                  )}
                  {/* save button */}
                  <SignedIn>
                    {articleResultStatus === "pending" && (
                      <button
                        type="button"
                        className="btn btn-square btn-ghost opacity-60"
                        disabled={true}
                      >
                        <BookmarkIcon size={24} />
                      </button>
                    )}
                    {articleResultStatus === "success" && (
                      <SaveButton
                        articleId={article.id}
                        initialIsCollected={article.isCollected ?? false}
                      />
                    )}
                  </SignedIn>
                  <SignedOut>
                    <div className="lg:tooltip" data-tip={t("btn.favorite")}>
                      <button
                        type="button"
                        className="btn btn-square btn-ghost"
                        disabled
                      >
                        <BookmarkIcon size={24} weight="light" />
                      </button>
                    </div>
                  </SignedOut>
                  {/* more button */}
                  <MoreButton
                    isOwnStory={isOwnStory}
                    authorId={article.creator.id}
                    articleId={article.id}
                    onRemoveFromReadingHistory={() =>
                      setIsRemovingFromHistory(true)
                    }
                    onRemoveFromList={onRemoveFromList}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </li>
    </div>
  );
}
