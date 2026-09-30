import { CLEAR_READING_HISTORY_MODAL_ID } from "@/constants/modal";
import { useClearReadingHistory } from "./readingHistory";

export default function ClearReadingHistoryModal() {
  const { isClearing, handleClear } = useClearReadingHistory();

  function handleConfirm() {
    handleClear(undefined, {
      onSuccess: () => {
        (
          document.getElementById(
            CLEAR_READING_HISTORY_MODAL_ID,
          ) as HTMLDialogElement
        )?.close();
      },
    });
  }

  return (
    <dialog id={CLEAR_READING_HISTORY_MODAL_ID} className="modal">
      <div className="modal-box w-11/12 md:max-w-4xl md:aspect-5/3 flex flex-col items-center justify-center text-center">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            disabled={isClearing}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <h1 className="text-center font-bold text-xl md:text-3xl">
          Clear reading history
        </h1>
        <p className="pt-2 pb-3 text-sm md:text-base text-base-content/60 text-center max-w-9/12">
          The stories that are cleared will no longer influence the
          recommendations that you receive in your feed or email digest
        </p>
        <div className="modal-action justify-center items-center gap-2 md:gap-4">
          <form method="dialog">
            {/* if there is a button, it will close the modal */}
            <button
              disabled={isClearing}
              className="btn btn-outline btn-sm md:btn-md rounded-full"
            >
              Cancel
            </button>
          </form>
          <button
            disabled={isClearing}
            onClick={handleConfirm}
            className="btn btn-error btn-sm md:btn-md rounded-full text-base-100"
          >
            {isClearing && <span className="loading loading-spinner"></span>}
            {!isClearing && "Confirm and clear"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
