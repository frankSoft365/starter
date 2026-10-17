import CurrentUser from "@/ui/utils/CurrentUser";
import { DotsThreeIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import {
  useLocation,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import { DELETE_ARTICLE_MODAL_ID } from "@/constants/modal";
import { useSetAtom } from "jotai";
import { deleteArticleModalAtom } from "@/atoms/deleteArticleModal";
import { Route as readingHistoryRoute } from "@/routes/_app/_protected/me/lists/reading-history";
import { Route as profileHomeRoute } from "@/routes/_app/_protected/profile/$userId/_profile/index";
import { useArticleSetPinnedByCreatorAt } from "./article";
import { useRef } from "react";

export default function MoreButton({
  isOwnStory,
  authorId,
  articleId,
  pinnedByCreatorAt = "0",
  onRemoveFromReadingHistory,
  onRemoveFromList,
}: {
  isOwnStory: boolean;
  authorId: string;
  articleId: string;
  pinnedByCreatorAt?: string;
  onRemoveFromReadingHistory?: () => void;
  onRemoveFromList?: () => void;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLUListElement>(null);
  const popoverId = `popover-more-${articleId}`;
  const anchorName = `--anchor-more-${articleId}`;
  const setOptions = useSetAtom(deleteArticleModalAtom);

  // derived state for rendering of
  // trash button (remove from reading history button)
  const isReadingHistoryRoute = location.pathname === readingHistoryRoute.to;
  const isOwnProfileHomeRoute = useRouterState({
    select: (state) =>
      state.matches.some(
        (match) =>
          match.routeId === profileHomeRoute.id &&
          match.params.userId === authorId,
      ),
  });

  function clickDeleteArticle() {
    setOptions({
      articleDeletedId: articleId,
    });
    (
      document.getElementById(DELETE_ARTICLE_MODAL_ID) as HTMLDialogElement
    )?.showModal();
  }

  // pin a article
  const { handlePinArticle, isPinning } =
    useArticleSetPinnedByCreatorAt(authorId);

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
        ref={popoverRef}
        className="dropdown menu min-w-52 bg-base-100 shadow-lg"
        popover="auto"
        id={popoverId}
        style={{ positionAnchor: anchorName }}
      >
        {/* remove from reading history */}
        {isReadingHistoryRoute && (
          <li>
            <button
              className="btn btn-ghost justify-start text-red-600 font-normal"
              onClick={onRemoveFromReadingHistory}
            >
              {t("btn.removeFromReadingHistory")}
            </button>
          </li>
        )}
        {!isOwnStory && (
          <li>
            <button className="btn btn-ghost justify-start font-normal">
              <ThumbsDownIcon size={24} weight="light" />
              Show less like this
            </button>
          </li>
        )}
        {/* edit article */}
        <CurrentUser authorId={authorId}>
          <li>
            <button
              onClick={() =>
                navigate({
                  to: articleEditRoute.to,
                  params: { articleId: articleId },
                })
              }
              className="btn btn-ghost justify-start font-normal"
            >
              {t("btn.editArticle")}
            </button>
          </li>
        </CurrentUser>
        {/* Pin this article to your profile
        Unpin this article from your profile */}
        {isOwnProfileHomeRoute && (
          <CurrentUser authorId={authorId}>
            <li>
              <button
                onClick={() => {
                  handlePinArticle({
                    isPinned: pinnedByCreatorAt === "0",
                    articleId,
                  });
                  popoverRef.current?.hidePopover?.();
                }}
                disabled={isPinning}
                type="button"
                className="btn btn-ghost justify-start font-normal"
              >
                {t(
                  pinnedByCreatorAt !== "0"
                    ? "btn.unpinArticle"
                    : "btn.pinArticle",
                )}
              </button>
            </li>
          </CurrentUser>
        )}
        {/* follow author */}
        {!isOwnStory && (
          <li>
            <button className="btn btn-ghost justify-start font-normal">
              Follow author
            </button>
          </li>
        )}
        {!isOwnStory && (
          <li>
            <button className="btn btn-ghost justify-start text-red-600 font-normal">
              Report story...
            </button>
          </li>
        )}
        {/* remove article from your collection */}
        {onRemoveFromList && (
          <li>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromList();
              }}
              className="btn btn-ghost justify-start text-red-600 font-normal"
            >
              {t("profile.list.removeItem")}
            </button>
          </li>
        )}
        {/* the author delete his article */}
        <CurrentUser authorId={authorId}>
          <li>
            <button
              className="btn btn-ghost justify-start text-red-600 font-normal"
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
