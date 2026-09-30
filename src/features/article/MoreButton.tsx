import CurrentUser from "@/ui/CurrentUser";
import { DotsThreeIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import { DELETE_ARTICLE_MODAL_ID } from "@/constants/modal";
import { useSetAtom } from "jotai";
import { deleteArticleModalAtom } from "@/atoms/deleteArticleModal";
import { Route as readingHistoryRoute } from "@/routes/_app/_protected/me/lists/reading-history";

export default function MoreButton({
  isOwnStory,
  authorId,
  articleId,
  onRemoveFromReadingHistory,
  onRemoveFromList,
}: {
  isOwnStory: boolean;
  authorId: string;
  articleId: string;
  onRemoveFromReadingHistory?: () => void;
  onRemoveFromList?: () => void;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const popoverId = `popover-more-${articleId}`;
  const anchorName = `--anchor-more-${articleId}`;
  const setOptions = useSetAtom(deleteArticleModalAtom);

  // derived state for rendering of
  // trash button (remove from reading history button)
  const isReadingHistoryRoute = location.pathname === readingHistoryRoute.to;

  function clickDeleteArticle() {
    setOptions({
      articleDeletedId: articleId,
    });
    (
      document.getElementById(DELETE_ARTICLE_MODAL_ID) as HTMLDialogElement
    )?.showModal();
  }

  return (
    <div
      className="lg:tooltip"
      data-tip={t("btn.more")}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="btn btn-square btn-ghost"
        popoverTarget={popoverId}
        style={{ anchorName }}
      >
        <DotsThreeIcon size={24} weight="bold" />
      </button>
      <ul
        className="dropdown menu min-w-52 bg-base-100 shadow-lg"
        popover="auto"
        id={popoverId}
        style={{ positionAnchor: anchorName }}
      >
        {/* remove from reading history */}
        {isReadingHistoryRoute && (
          <li>
            <button
              className="btn btn-ghost justify-start text-red-600"
              onClick={onRemoveFromReadingHistory}
            >
              {t("btn.removeFromReadingHistory")}
            </button>
          </li>
        )}
        {!isOwnStory && (
          <li>
            <button className="btn btn-ghost justify-start">
              <ThumbsDownIcon size={24} weight="light" />
              Show less like this
            </button>
          </li>
        )}
        <CurrentUser authorId={authorId}>
          <li>
            <button
              onClick={() =>
                navigate({
                  to: articleEditRoute.to,
                  params: { articleId: articleId },
                })
              }
              className="btn btn-ghost justify-start"
            >
              {t("btn.editArticle")}
            </button>
          </li>
        </CurrentUser>
        {!isOwnStory && (
          <li>
            <button className="btn btn-ghost justify-start">
              Follow author
            </button>
          </li>
        )}
        {!isOwnStory && (
          <li>
            <button className="btn btn-ghost justify-start text-red-600">
              Report story...
            </button>
          </li>
        )}
        {onRemoveFromList && (
          <li>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromList();
              }}
              className="btn btn-ghost justify-start text-red-600"
            >
              {t("profile.list.removeItem")}
            </button>
          </li>
        )}
        {/* the author delete his article */}
        <CurrentUser authorId={authorId}>
          <li>
            <button
              className="btn btn-ghost justify-start text-red-600"
              onClick={clickDeleteArticle}
            >
              {t("btn.deleteArticle")}
            </button>
          </li>
        </CurrentUser>
      </ul>
    </div>
  );
}
