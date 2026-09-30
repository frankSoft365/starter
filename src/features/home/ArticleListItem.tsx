import {
  BookmarkIcon,
  ChatCircleDotsIcon,
  HandsClappingIcon,
  RepeatIcon,
  ThumbsDownIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import type { ArticleListItemVO } from "@/types/article";
import ArticleMenuButton from "@/ui/ArticleMenuButton";
import { useTranslation } from "react-i18next";
import { formatLargeNumber } from "@/utils/number";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import MoreButton from "../article/MoreButton";
import SaveButton from "../article/SaveButton";
import ArticleAuthorInfo from "@/ui/ArticleAuthorInfo";
import SignedIn from "@/ui/SignedIn";
import SignedOut from "@/ui/SignedOut";
import ArticlePreviewImage from "./ArticlePreviewImage";
import useOverflowHelper from "@/utils/overflowHelper";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Route as articleDetailRoute } from "@/routes/_app/article.$articleId";
import { isDeletedArticle } from "../collection/CollectionListDetail";
import { Route as readingHistoryRoute } from "@/routes/_app/_protected/me/lists/reading-history";
import { useDeleteHistoryItem } from "../readingHistory/readingHistory";

export default function ArticleListItem({
  article,
  onRemoveFromList,
}: {
  article: ArticleListItemVO;
  onRemoveFromList?: () => void;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const { handleOverflow } = useOverflowHelper();
  const [isRemovingFromHistory, setIsRemovingFromHistory] = useState(false);

  const isOwnStory = user ? article.authorId === user.id : false;

  // derived state for rendering of
  // trash button (remove from reading history button)
  const isReadingHistoryRoute = location.pathname === readingHistoryRoute.to;

  const { handleDelete, isDeleting } = useDeleteHistoryItem();

  if (isDeletedArticle(article)) {
    return (
      <li className="list-row items-center flex">
        <div className="collapse w-full collapse-arrow bg-base-100">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title font-semibold text-base-content/70">
            Unavailable article
          </div>
          <div className="collapse-content text-sm text-base-content/60">
            This article was deleted by the author or banned.
          </div>
        </div>
      </li>
    );
  }

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
        id={`article-list-item-${article.id}`}
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
        <div className="flex flex-col gap-1 justify-between col-span-3 md:col-span-5">
          {/* user info */}
          <ArticleAuthorInfo
            authorId={article.authorId}
            authorAvatar={article.authorAvatar}
            authorName={article.authorName}
            publishTime={article.publishTime}
            className="text-xs md:text-sm"
          />
          {/* article content */}
          <div>
            <p className="text-lg md:text-2xl font-sans font-bold text-wrap mt-1 mb-2.5">
              {article.title}
            </p>
            <p className="text-sm text-base-content/70 md:text-base font-sans font-light text-wrap">
              {handleOverflow(article.subtitle, 118)}
            </p>
          </div>
          {/* actions */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-center [&_svg]:text-base-content/70">
            {/* left part actions */}
            <div className="flex flex-row">
              <div
                className="lg:tooltip"
                data-tip={t("btn.clap", { count: article.likeCount })}
              >
                <ArticleMenuButton>
                  <HandsClappingIcon size={20} />
                  {formatLargeNumber(article.likeCount)}
                </ArticleMenuButton>
              </div>
              <div
                className="lg:tooltip"
                data-tip={t("btn.response", { count: article.responseNum })}
              >
                <ArticleMenuButton>
                  <ChatCircleDotsIcon weight="fill" size={20} />
                  {article.responseNum}
                </ArticleMenuButton>
              </div>
              <div
                className="lg:tooltip"
                data-tip={t("btn.repost", { count: 20 })}
              >
                <ArticleMenuButton>
                  <RepeatIcon size={20} weight="light" />
                  20
                </ArticleMenuButton>
              </div>
            </div>
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
              <div className="lg:tooltip" data-tip={t("btn.notInterested")}>
                <button className="btn btn-square btn-ghost">
                  <ThumbsDownIcon size={24} weight="light" />
                </button>
              </div>
              {/* save button */}
              <SignedIn>
                <SaveButton articleId={article.id} />
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
                authorId={article.authorId}
                articleId={article.id}
                onRemoveFromReadingHistory={() =>
                  setIsRemovingFromHistory(true)
                }
                onRemoveFromList={onRemoveFromList}
              />
            </div>
          </div>
        </div>
        {article.coverImage && (
          <div className="content-center col-start-4 col-end-6 md:col-start-6 md:col-end-8">
            <ArticlePreviewImage
              url={article.coverImage}
              coverFocusY={article.coverFocusY}
            />
          </div>
        )}
      </li>
    </div>
  );
}
