import { DELETE_REPOST_MODAL_ID } from "@/constants/modal";
import { useDeleteRepost } from "./repost";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteRepostModal({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const MODAL_ID = `${DELETE_REPOST_MODAL_ID}_${articleId}`;
  function handleModalClose() {}

  const { handleDelete, isDeleting } = useDeleteRepost(articleId);

  const handleConfirm = () => {
    handleDelete(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get-user-repost-list", userId],
        });
        (document.getElementById(MODAL_ID) as HTMLDialogElement)?.close();
      },
    });
  };

  return (
    <dialog id={MODAL_ID} className="modal" onClose={handleModalClose}>
      <div className="modal-box w-11/12 md:max-w-xl flex flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <h1 className="font-bold text-xl">Delete repost with note</h1>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              disabled={isDeleting}
              className="btn btn-sm md:btn-md text-base-content/70 btn-circle btn-ghost"
            >
              ✕
            </button>
          </form>
        </div>

        <p className="text-sm md:text-md text-base-content">
          Your repost with a note will be permanently deleted and removed from
          your profile. This action is not reversible.
        </p>
        <div className="modal-action justify-end items-center gap-2">
          <form method="dialog">
            {/* if there is a button, it will close the modal */}
            <button
              disabled={isDeleting}
              className="btn btn-outline btn-sm md:btn-md rounded-full"
            >
              Cancel
            </button>
          </form>
          <button
            disabled={isDeleting}
            onClick={handleConfirm}
            className="btn btn-error btn-sm md:btn-md rounded-full text-base-100"
          >
            {isDeleting && <span className="loading loading-spinner"></span>}
            {!isDeleting && "Delete"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
