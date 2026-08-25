import { useNavigate } from "@tanstack/react-router";
import { useDeleteArticle } from "./article";
import { Route as homeRoute } from "@/routes/_app/_home/index";
import { useEffect, useRef } from "react";

export default function DeleteArticleModal({
    articleId,
    onClose,
}: {
    articleId: string | null;
    onClose: () => void;
}) {
    const navigate = useNavigate();
    const { handleDelete, isDeleting } = useDeleteArticle();
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (articleId && dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, [articleId]);

    return (
        <dialog ref={dialogRef} className="modal" onClick={(event) => event.stopPropagation()} onClose={onClose}>
            <div className="modal-box w-11/12 md:max-w-4xl md:aspect-5/3 flex flex-col items-center justify-center text-center">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h1 className="text-center font-bold text-xl md:text-3xl">Delete story</h1>
                <p className="pt-2 pb-3 text-sm md:text-base opacity-60 text-center max-w-9/12">Deletion is not reversible, and the story will be completely deleted. If you do not want to delete, you can unlist the story.</p>
                <div className="modal-action justify-center items-center gap-2 md:gap-4">
                    <form method="dialog">
                        {/* if there is a button, it will close the modal */}
                        <button className="btn btn-outline btn-sm md:btn-md rounded-full">Cancel</button>
                    </form>
                    <button disabled={isDeleting} onClick={() => {
                        if (!articleId) {
                            return;
                        }
                        const deleteRequest = { id: articleId };
                        handleDelete({ deleteRequest }, {
                            onSuccess: () => {
                                dialogRef.current?.close();
                                onClose();
                                navigate({ to: homeRoute.to });
                            }
                        });
                    }} className="btn btn-error btn-sm md:btn-md rounded-full">Delete</button>
                </div>
            </div>
        </dialog>
    );
}