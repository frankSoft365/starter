import { REPOST_WITH_NOTE_MODAL_ID } from "@/constants/modal";
import Avatar from "@/ui/Avatar";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import type { ArticleDetail, ArticlePreview } from "@/types/article";
import { useEffect, useState } from "react";
import {
  getRepostNoteStatus,
  useAddNote,
  useEditNote,
  useRepostAnArticleWithNote,
} from "./repost";
import type { RepostState } from "@/types/repost";
import RepostArticlePreview from "./RepostArticlePreview";
import NoteLengthProgress from "./NoteLengthProgress";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function RepostWithNoteModal({
  article,
  repostState,
  setBtnState,
  invalidateList = false,
}: {
  article: ArticleDetail | ArticlePreview;
  repostState: RepostState;
  setBtnState?: React.Dispatch<
    React.SetStateAction<"idle" | "rotatingP" | "rotatingN" | "reposted">
  >;
  invalidateList?: boolean;
}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const repostStateKey = ["get-repost-state", article.id];
  const MODAL_ID = `${REPOST_WITH_NOTE_MODAL_ID}_${article.id}`;
  const user = useAtomValue(userAtom);

  const [note, setNote] = useState<string>(repostState.note ?? "");

  useEffect(() => {
    setNote(repostState.note ?? "");
  }, [repostState.note]);

  const canRepost = note.length <= 280;

  const canSave = note.trim().length > 0 && note.length <= 280;
  // edit note
  const canEdit = note !== repostState.note;

  const { handleRepostWithNote, isReposting } = useRepostAnArticleWithNote(
    article.id,
    setBtnState,
  );
  const { handleAddNote, isSaving } = useAddNote(article.id);
  const { handleEditNote, isEditing } = useEditNote(article.id);
  const repostNoteStatus = getRepostNoteStatus(repostState);

  const handleRepost = () => {
    if (!canRepost) {
      return;
    }
    handleRepostWithNote(
      { note },
      {
        onSuccess: () => {
          (document.getElementById(MODAL_ID) as HTMLDialogElement)?.close();
        },
      },
    );
  };

  function handleSave() {
    if (!canSave) {
      return;
    }
    handleAddNote(
      { note },
      {
        onSuccess: () => {
          invalidateList
            ? queryClient.invalidateQueries({
                queryKey: ["get-user-repost-list", repostState.userId],
              })
            : queryClient.invalidateQueries({ queryKey: repostStateKey });
          (document.getElementById(MODAL_ID) as HTMLDialogElement)?.close();
        },
      },
    );
  }

  function handleEdit() {
    if (!canEdit) {
      return;
    }
    handleEditNote(
      { note },
      {
        onSuccess: () => {
          invalidateList
            ? queryClient.invalidateQueries({
                queryKey: ["get-user-repost-list", repostState.userId],
              })
            : queryClient.invalidateQueries({ queryKey: repostStateKey });
          (document.getElementById(MODAL_ID) as HTMLDialogElement)?.close();
        },
      },
    );
  }

  return (
    <dialog id={MODAL_ID} className="modal">
      <div className="modal-box w-11/12 md:max-w-3xl flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          {/* current user info */}
          <div className="flex items-center gap-2">
            <Avatar
              imageUrl={user?.image ?? ""}
              username={user?.username ?? ""}
              size="sm"
            />
            <span className="text-sm">{user?.username}</span>
          </div>

          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              disabled={isReposting || isSaving || isEditing}
              className="btn btn-sm md:btn-lg btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
        </div>

        <div className="flex items-center justify-start gap-2">
          {/* divider */}
          <div className="w-8 mx-0 divider divider-horizontal"></div>
          {/* note and article preview */}
          <div className="w-full">
            {/* note input */}
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              type="text"
              placeholder={t("repost.notePlaceholder")}
              className="w-full bg-base-100 text-sm text-base-content outline-none transition"
            />
            {/* article preview */}
            <RepostArticlePreview article={article} />
          </div>
        </div>
        <div className="modal-action w-full justify-between items-center">
          {/* note length indicator */}
          <NoteLengthProgress note={note} />
          {/* confirm button */}
          {repostNoteStatus.isRepostWithNote && (
            <button
              disabled={!canRepost || isReposting}
              onClick={handleRepost}
              className="btn btn-neutral btn-sm md:btn-md rounded-full"
            >
              {isReposting && <span className="loading loading-spinner"></span>}
              {!isReposting && t("btn.repost")}
            </button>
          )}
          {repostNoteStatus.isAddNote && (
            <button
              disabled={!canSave || isSaving}
              onClick={handleSave}
              className="btn btn-neutral btn-sm md:btn-md rounded-full"
            >
              {isSaving && <span className="loading loading-spinner"></span>}
              {!isSaving && t("btn.save")}
            </button>
          )}
          {repostNoteStatus.isEditOrRemoveNote && (
            <button
              disabled={!canEdit || isEditing}
              onClick={handleEdit}
              className="btn btn-neutral btn-sm md:btn-md rounded-full"
            >
              {isEditing && <span className="loading loading-spinner"></span>}
              {!isEditing && t("btn.save")}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
