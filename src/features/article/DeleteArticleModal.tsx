import { deleteArticleModalAtom } from "@/atoms/deleteArticleModal";
import { DELETE_ARTICLE_MODAL_ID } from "@/constants/modal";
import { useAtom } from "jotai";
import { useDeleteArticle } from "./article";
import { useNavigate } from "@tanstack/react-router";
import { Route as homeRoute } from "@/routes/_app/_home/index";

export default function DeleteArticleModal() {
  const navigate = useNavigate();
  const [options, setOptions] = useAtom(deleteArticleModalAtom);
  const { isDeleting, handleDelete } = useDeleteArticle();
  function handleModalClose() {
    setOptions(null);
  }

  const handleConfirm = () => {
    if (options) {
      handleDelete(
        { articleDeletedId: options.articleDeletedId },
        {
          onSuccess: () => {
            (
              document.getElementById(
                DELETE_ARTICLE_MODAL_ID,
              ) as HTMLDialogElement
            )?.close();
            // 只要删除就跳回主页
            navigate({ to: homeRoute.to });
          },
        },
      );
    }
  };

  return (
    <dialog
      id={DELETE_ARTICLE_MODAL_ID}
      className="modal"
      onClose={handleModalClose}
    >
      <div className="modal-box w-11/12 md:max-w-4xl md:aspect-5/3 flex flex-col items-center justify-center text-center">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            disabled={isDeleting}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <h1 className="text-center font-bold text-xl md:text-3xl">
          Delete story
        </h1>
        <p className="pt-2 pb-3 text-sm md:text-base text-base-content/60 text-center max-w-9/12">
          Deletion is not reversible, and the story will be completely deleted.
          If you do not want to delete, you can unlist the story.
        </p>
        <div className="modal-action justify-center items-center gap-2 md:gap-4">
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
