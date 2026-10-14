import CurrentUser from "@/ui/utils/CurrentUser";
import { BookmarkIcon, DotsThreeIcon, UsersIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import {
  DELETE_REPOST_MODAL_ID,
  REMOVE_NOTE_OF_REPOST_MODAL_ID,
  REPOST_WITH_NOTE_MODAL_ID,
} from "@/constants/modal";
import RepostWithNoteModal from "./RepostWithNoteModal";
import RemoveNoteModal from "./RemoveNoteModal";
import type { RepostState } from "@/types/repost";
import { getRepostNoteStatus } from "./repost";
import type { ArticlePreview } from "@/types/article";
import DeleteRepostModal from "./DeleteRepostModal";

export default function MoreButton({
  repostState,
  article,
}: {
  repostState: RepostState;
  article: ArticlePreview;
}) {
  const REPOST_WITH_NOTE_MODAL = `${REPOST_WITH_NOTE_MODAL_ID}_${article.id}`;
  const REMOVE_NOTE_OF_REPOST_MODAL = `${REMOVE_NOTE_OF_REPOST_MODAL_ID}_${article.id}`;
  const DELETE_REPOST_MODAL = `${DELETE_REPOST_MODAL_ID}_${article.id}`;
  const { t } = useTranslation();
  const popoverId = `popover-more-${article.id}`;
  const anchorName = `--anchor-more-${article.id}`;

  // 操作文本
  const repostNoteStatus = getRepostNoteStatus(repostState);

  return (
    <div>
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
        {/* <ul
        tabIndex={-1}
        className="dropdown-content menu z-1 w-52 bg-base-100 p-2 shadow-sm"
      >
        <li>
          <button
            onClick={(event) => {
              if (isReposted) {
                handleDelete();
              } else {
                handleRepost();
              }
              event.currentTarget.blur();
            }}
          >
            <ArrowsClockwiseIcon size={24} />
            {isReposted ? "Undo repost" : "Repost"}
          </button>
        </li>
        
      </ul> */}
      </div>
      <ul
        className="dropdown menu min-w-52 bg-base-100 shadow-lg"
        popover="auto"
        id={popoverId}
        style={{ positionAnchor: anchorName }}
      >
        {/* {!isOwnStory && (
          <li>
            <button className="btn btn-ghost justify-start">
              Follow author
            </button>
          </li>
        )} */}

        {/* the reposter actions */}
        <CurrentUser
          authorId={repostState.userId}
          fallback={
            <>
              <li>
                <button>
                  <BookmarkIcon size={24} weight="light" />
                  Save article
                </button>
              </li>
              <li>
                <button>
                  <UsersIcon size={24} weight="light" />
                  Unfollow @Franksoft
                </button>
              </li>
            </>
          }
        >
          {repostNoteStatus.isAddNote && (
            <li>
              <button
                onClick={() => {
                  (
                    document.getElementById(
                      REPOST_WITH_NOTE_MODAL,
                    ) as HTMLDialogElement
                  )?.showModal();
                }}
              >
                Add a note
              </button>
            </li>
          )}
          {repostNoteStatus.isEditOrRemoveNote && (
            <li>
              <button
                onClick={() => {
                  (
                    document.getElementById(
                      REPOST_WITH_NOTE_MODAL,
                    ) as HTMLDialogElement
                  )?.showModal();
                }}
              >
                Edit note
              </button>
            </li>
          )}
          {repostNoteStatus.isEditOrRemoveNote && (
            <li>
              <button
                onClick={() => {
                  (
                    document.getElementById(
                      REMOVE_NOTE_OF_REPOST_MODAL,
                    ) as HTMLDialogElement
                  )?.showModal();
                }}
              >
                {"Remove note"}
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => {
                (
                  document.getElementById(
                    DELETE_REPOST_MODAL,
                  ) as HTMLDialogElement
                )?.showModal();
              }}
              className="text-red-600"
            >
              Delete repost
            </button>
          </li>
        </CurrentUser>
      </ul>
      <RepostWithNoteModal
        article={article}
        repostState={repostState}
        invalidateList
      />
      <RemoveNoteModal
        articleId={article.id}
        invalidateList
        userId={repostState.userId}
      />
      <DeleteRepostModal articleId={article.id} userId={repostState.userId} />
    </div>
  );
}
