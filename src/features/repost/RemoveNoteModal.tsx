import { REMOVE_NOTE_OF_REPOST_MODAL_ID } from "@/constants/modal";
import { useRemoveNote } from "./repost";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function RemoveNoteModal({
  articleId,
  invalidateList = false,
  userId,
}: {
  articleId: string;
  invalidateList?: boolean;
  userId?: string;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const repostStateKey = ["get-repost-state", articleId];
  const MODAL_ID = `${REMOVE_NOTE_OF_REPOST_MODAL_ID}_${articleId}`;
  function handleModalClose() {}

  const { handleRemoveNote, isRemoving } = useRemoveNote(articleId);

  const handleConfirm = () => {
    handleRemoveNote(undefined, {
      onSuccess: () => {
        invalidateList
          ? queryClient.invalidateQueries({
              queryKey: ["get-user-repost-list", userId],
            })
          : queryClient.invalidateQueries({ queryKey: repostStateKey });
        (document.getElementById(MODAL_ID) as HTMLDialogElement)?.close();
      },
    });
  };

  return (
    <dialog id={MODAL_ID} className="modal" onClose={handleModalClose}>
      <div className="modal-box w-11/12 md:max-w-xl flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <h1 className="font-bold text-xl md:text-2xl">
            {t("repost.removeNoteTitle")}
          </h1>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              disabled={isRemoving}
              className="btn btn-sm md:btn-lg text-base-content/70 btn-circle btn-ghost"
            >
              ✕
            </button>
          </form>
        </div>

        <p className="text-sm md:text-lg text-base-content/60">
          {t("repost.removeNoteDesc")}
        </p>
        <div className="modal-action justify-end items-center gap-2">
          <form method="dialog">
            {/* if there is a button, it will close the modal */}
            <button
              disabled={isRemoving}
              className="btn btn-outline btn-sm md:btn-md rounded-full"
            >
              {t("btn.cancel")}
            </button>
          </form>
          <button
            disabled={isRemoving}
            onClick={handleConfirm}
            className="btn btn-neutral btn-sm md:btn-md rounded-full text-base-100"
          >
            {isRemoving && <span className="loading loading-spinner"></span>}
            {!isRemoving && t("btn.remove")}
          </button>
        </div>
      </div>
    </dialog>
  );
}
