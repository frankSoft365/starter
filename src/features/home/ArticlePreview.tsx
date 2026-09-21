import {
  BookmarkIcon,
  ChatCircleDotsIcon,
  HandsClappingIcon,
  RepeatIcon,
  ThumbsDownIcon,
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
import { useLocation } from "@tanstack/react-router";
import { Route as activityRoute } from "@/routes/_app/_protected/profile/$userId/_profile/activity";
import useOverflowHelper from "@/utils/overflowHelper";

export default function ArticlePreview({
  article,
  onDelete,
  onRemoveFromList,
}: {
  article: ArticleListItemVO;
  onDelete: () => void;
  onRemoveFromList?: () => void;
}) {
  const { t } = useTranslation();
  const user = useAtomValue(userAtom);
  const location = useLocation();
  const { userId } = activityRoute.useParams();
  const { handleOverflow } = useOverflowHelper();

  const isActivityPath =
    location.pathname === activityRoute.to.replace("$userId", userId);

  const isOwnStory = user ? article.authorId === user.id : false;

  return (
    <div className="grid min-h-48 cursor-pointer grid-cols-5 gap-4 md:grid-cols-7">
      <div className="flex flex-col gap-4 justify-around col-span-3 md:col-span-5">
        {/* article content */}
        <div className="flex flex-col gap-2">
          <p className="text-lg md:text-2xl font-sans font-bold text-wrap">
            {article.title}
          </p>
          <p className="text-sm opacity-60 md:text-base font-sans font-light text-wrap mb-1">
            {handleOverflow(article.subtitle, 118)}
          </p>
        </div>
        <div>
          {/* user info */}
          <div className="mb-2">
            <ArticleAuthorInfo
              authorId={article.authorId}
              authorAvatar={article.authorAvatar}
              authorName={article.authorName}
              publishTime={article.publishTime}
              className="text-xs md:text-sm"
            />
          </div>
          {/* actions */}
          <div className="flex flex-col lg:flex-row justify-between lg:items-center text-base-content/70 [&_button]:text-base-content/70 [&_svg]:text-base-content/70">
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
            <div className="flex flex-row justify-start gap-1">
              {!isActivityPath && (
                <div className="lg:tooltip" data-tip={t("btn.notInterested")}>
                  <button className="btn btn-square btn-ghost">
                    <ThumbsDownIcon size={24} weight="light" />
                  </button>
                </div>
              )}
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
                onDelete={onDelete}
                onRemoveFromList={onRemoveFromList}
              />
            </div>
          </div>
        </div>
      </div>
      {article.coverImage && (
        <div className="content-start col-start-4 col-end-6 md:col-start-6 md:col-end-8">
          <ArticlePreviewImage
            url={article.coverImage}
            coverFocusY={article.coverFocusY}
          />
        </div>
      )}
    </div>
  );
}
