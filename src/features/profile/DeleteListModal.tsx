import { useTranslation } from "react-i18next";
import { useDeleteCollectionList } from "./collection";

export default function DeleteListModal({
    listId,
    onClose,
    onDeleted,
}: {
    listId: string;
    onClose: () => void;
    onDeleted?: () => void;
}) {
    const { t } = useTranslation();
    const { mutate, isPending } = useDeleteCollectionList();

    return (
        <div
            className="modal modal-open pointer-events-auto"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div className="modal-box w-11/12 md:max-w-4xl aspect-5/3 flex flex-col items-center justify-center text-center" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                >✕</button>
                <h1 className="text-center font-bold text-xl md:text-3xl">{t('profile.list.deleteTitle')}</h1>
                <p className="pt-2 pb-3 text-sm md:text-base opacity-60 text-center max-w-9/12">{t('profile.list.deleteConfirmDesc')}</p>
                <div className="modal-action justify-center items-center gap-2 md:gap-4">
                    <button
                        type="button"
                        className="btn btn-outline btn-sm md:btn-md rounded-full"
                        onClick={onClose}
                        disabled={isPending}
                    >
                        {t('btn.cancel')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-error btn-sm md:btn-md rounded-full"
                        disabled={isPending}
                        onClick={() => {
                            mutate(listId, {
                                onSuccess: () => {
                                    onDeleted?.();
                                    onClose();
                                },
                            });
                        }}
                    >
                        {isPending && <span className="loading loading-spinner loading-sm"></span>}
                        {t('profile.list.deleteList')}
                    </button>
                </div>
            </div>
        </div>
    );
}
