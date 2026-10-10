import type { ArticleVO } from "@/types/article";
import RemoveNoteModal from "./RemoveNoteModal";
import RepostWithNoteModal from "./RepostWithNoteModal";
import type { RepostState } from "@/types/repost";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import { useTranslation } from "react-i18next";
import {
  getRepostNoteStatus,
  useOptimisticDeleteRepost,
  useRepostAnArticle,
  useRepostCount,
} from "./repost";
import { useState } from "react";
import {
  REMOVE_NOTE_OF_REPOST_MODAL_ID,
  REPOST_USER_LIST_MODAL_ID,
  REPOST_WITH_NOTE_MODAL_ID,
} from "@/constants/modal";
import {
  ArrowsClockwiseIcon,
  NotePencilIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import RepostUserListModal from "./RepostUserListModal";

export default function RepostButton({
  article,
  repostState,
}: {
  article: ArticleVO;
  repostState: RepostState;
}) {
  const REPOST_WITH_NOTE_MODAL = `${REPOST_WITH_NOTE_MODAL_ID}_${article.id}`;
  const REMOVE_NOTE_OF_REPOST_MODAL = `${REMOVE_NOTE_OF_REPOST_MODAL_ID}_${article.id}`;
  const { t } = useTranslation();
  const user = useAtomValue(userAtom);
  const isOwnStory = article.authorId === user?.id;
  // 查询计数
  const { data: repostCount, isLoading } = useRepostCount([article.id]);
  const repostDisplayCount = repostCount?.get(article.id) ?? "--";
  // 按钮动画相关的状态:
  // 未转发 正向旋转 反向旋转 已转发
  const [btnState, setBtnState] = useState<
    "idle" | "rotatingP" | "rotatingN" | "reposted"
  >(repostState?.hasReposted ? "reposted" : "idle");
  // 动画相关的状态 用户转发的状态与动画状态相结合后用于样式指示
  const isReposted =
    repostState.hasReposted ||
    btnState === "reposted" ||
    btnState === "rotatingP";

  // 操作API
  const { handleRepost } = useRepostAnArticle(article.id, setBtnState);
  const { handleDelete } = useOptimisticDeleteRepost(article.id, setBtnState);
  // 操作文本
  const repostNoteStatus = getRepostNoteStatus(repostState);

  // 转发详情
  const [showSignal, setShowSignal] = useState<number>(0);

  return (
    <>
      {isOwnStory ? (
        <div className="lg:tooltip font-light" data-tip={t("btn.repostIsOwn")}>
          <button disabled className="btn btn-ghost px-0">
            <ArrowsClockwiseIcon size={24} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn p-0 bg-base-100 border-0"
            >
              <div className="lg:tooltip font-light" data-tip={t("btn.repost")}>
                <svg
                  viewBox="0 0 256 256"
                  width="24"
                  height="24"
                  fill="none"
                  className={
                    isReposted
                      ? "text-success"
                      : "text-base-content/60 hover:text-base-content"
                  }
                  aria-hidden="true"
                >
                  <g
                    className={`origin-center transition-transform duration-700 ${
                      btnState === "reposted" || btnState === "rotatingP"
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                    onTransitionEnd={(event) => {
                      if (
                        event.target !== event.currentTarget ||
                        (event.propertyName !== "rotate" &&
                          event.propertyName !== "transform")
                      ) {
                        return;
                      }

                      if (btnState === "rotatingP") {
                        setBtnState("reposted");
                        return;
                      }

                      if (btnState === "rotatingN") {
                        setBtnState("idle");
                      }
                    }}
                  >
                    <polyline
                      points="168 96 216 96 216 48"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                    <path
                      d="M216 96 187.72 67.72A88 88 0 0 0 64 67"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                    <polyline
                      points="88 160 40 160 40 208"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                    <path
                      d="M40 160 68.28 188.28A88 88 0 0 0 192 189"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="16"
                    />
                  </g>
                  <path
                    d="M100 128l18 18 38-40"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-opacity duration-700 ${isReposted ? "opacity-100" : "opacity-0"}`}
                  />
                </svg>
              </div>
            </div>
            <ul
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
              {repostNoteStatus.isRepostWithNote && (
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
                    <NotePencilIcon size={24} />
                    Repost with a note
                  </button>
                </li>
              )}
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
                    <NotePencilIcon size={24} />
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
                    <NotePencilIcon size={24} />
                    {"Edit note"}
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
                    <XCircleIcon size={24} />
                    {"Remove note"}
                  </button>
                </li>
              )}
            </ul>
          </div>
          {!isOwnStory && (
            <>
              {isLoading ? (
                <span className="text-sm text-base-content/60">--</span>
              ) : (
                <div className="lg:tooltip" data-tip="View reposts">
                  <span
                    onClick={() => {
                      setShowSignal((pre) => pre + 1);
                      (
                        document.getElementById(
                          REPOST_USER_LIST_MODAL_ID,
                        ) as HTMLDialogElement
                      )?.showModal();
                    }}
                    className="text-sm text-base-content/60 hover:text-base-content cursor-pointer"
                  >
                    {repostDisplayCount}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <RepostWithNoteModal
        article={article}
        repostState={repostState}
        setBtnState={setBtnState}
      />
      <RemoveNoteModal articleId={article.id} />
      <RepostUserListModal showSignal={showSignal} />
    </>
  );
}
