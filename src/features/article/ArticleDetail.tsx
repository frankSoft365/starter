import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import Loading from "@/ui/Loading";
import Avatar from "@/ui/Avatar";
import { getPublishDate } from "@/utils/dateHelper";
import EditorComponent from "@/ui/EditorComponent";
import { BookmarkIcon, ChatCircleDotsIcon, DotsThreeIcon, ExportIcon, HandsClappingIcon, RepeatIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import ArticleMenuButton from "@/ui/ArticleMenuButton";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import { useNavigate } from "@tanstack/react-router";
import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import { useCreateBlockNote } from "@blocknote/react";
import { useCurrentArticle, useDeleteArticle } from "./article";
import { Route as homeRoute } from "@/routes/_app/index";
import CurrentUser from "@/ui/CurrentUser";

export default function ArticleDetail() {
    const navigate = useNavigate();
    const { articleId } = articleRoute.useParams();
    const user = useAtomValue(userAtom);
    const editor = useCreateBlockNote();

    const { processedArticle, isLoading, isError, error } = useCurrentArticle(articleId, editor);
    const { handleDelete, isDeleting } = useDeleteArticle();

    const article = processedArticle?.article;
    const title = processedArticle?.title;

    const isOwnStory = article?.authorId === user?.id;
    const meneButtonColor = isOwnStory ? "#adadad" : "#676565";

    return (
        <>
            {isLoading && !isError && <Loading />}
            {isError && <main className="flex items-center justify-center min-h-screen">
                <div className="text-3xl text-red-600">
                    {error?.message || 'Failed to load article content.'}
                </div>
            </main>}
            {!isLoading && !isError && article && <>
                <div className="flex flex-col items-center w-full lg:w-3xl mx-auto">
                    <h1 className="text-center font-sans font-bold text-3xl lg:text-5xl m-6">{title}</h1>
                    <div className="flex flex-row items-center text-sm gap-1">
                        <Avatar imageUrl={article.authorAvatar} username={article.authorName} size="sm" />
                        <span className="ml-1.5">{article.authorName}</span>
                        <span>·</span>
                        <span className="text-gray-500">{getPublishDate(new Date(article.publishTime))}</span>
                    </div>
                    <div className="divider mb-0"></div>
                    <div className="flex flex-row items-center justify-around w-full">
                        <div className="flex flex-row">
                            <div className="lg:tooltip mx-2" data-tip={isOwnStory ? 'Your cannot applaud your own story' : "3K claps"}>
                                <ArticleMenuButton disable={isOwnStory}>
                                    <HandsClappingIcon size={24} color={meneButtonColor} weight="light" />
                                    {!isOwnStory && '3K'}
                                </ArticleMenuButton>
                            </div>
                            <div className="lg:tooltip mx-2" data-tip="Respond">
                                <ArticleMenuButton>
                                    <ChatCircleDotsIcon size={24} color="#676565" weight="light" />
                                    {!isOwnStory && '90'}
                                </ArticleMenuButton>
                            </div>
                            <div className="lg:tooltip mx-2" data-tip={isOwnStory ? 'Your cannot repost your own story' : "20 reposts"}>
                                <ArticleMenuButton disable={isOwnStory}>
                                    <RepeatIcon size={24} color={meneButtonColor} weight="light" />
                                    {!isOwnStory && '20'}
                                </ArticleMenuButton>
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className="lg:tooltip mx-2" data-tip="Save">
                                <button className="btn btn-square btn-ghost">
                                    <BookmarkIcon size={24} color="#676565" weight="light" />
                                </button>
                            </div>
                            <div className="lg:tooltip mx-2" data-tip="Share">
                                <button className="btn btn-square btn-ghost">
                                    <ExportIcon size={24} color="#676565" weight="light" />
                                </button>
                            </div>
                            <div className="lg:tooltip mx-2" data-tip="More">
                                <button className="btn btn-square btn-ghost" popoverTarget="popover-1" style={{ anchorName: "--anchor-1" }} >
                                    <DotsThreeIcon size={24} color="#676565" weight="bold" />
                                </button>
                                <ul className="dropdown menu w-52 bg-base-100 shadow-lg"
                                    popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" }}>
                                    {!isOwnStory && <li>
                                        <button className="btn btn-ghost justify-start">
                                            <ThumbsDownIcon size={24} color="#676565" weight="light" />
                                            Show less like this
                                        </button>
                                    </li>}
                                    <CurrentUser authorId={article.authorId}>
                                        <li>
                                            <button onClick={() => navigate({ to: articleEditRoute.to, params: { articleId: article.id } })} className="btn btn-ghost justify-start">
                                                Edit story
                                            </button>
                                        </li>
                                    </CurrentUser>
                                    {!isOwnStory && <li><button className="btn btn-ghost justify-start">
                                        Follow author
                                    </button></li>}
                                    {!isOwnStory && <li><button className="btn btn-ghost justify-start text-red-600">
                                        Report story...
                                    </button></li>}
                                    <CurrentUser authorId={article.authorId}>
                                        <li>
                                            <button onClick={() => {
                                                const modal = document.getElementById('my_modal_3');
                                                if (modal instanceof HTMLDialogElement) {
                                                    modal.showModal();
                                                }
                                            }} className="btn btn-ghost justify-start text-red-600">
                                                Delete story
                                            </button>
                                        </li>
                                    </CurrentUser>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="divider mt-0"></div>
                </div>
                <dialog id="my_modal_3" className="modal">
                    <div className="modal-box w-11/12 md:max-w-4xl aspect-5/3 flex flex-col items-center justify-center text-center">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h1 className="text-center font-bold text-xl md:text-3xl">Delete story</h1>
                        <p className="pt-2 pb-3 text-sm md:text-base text-gray-500 text-center max-w-9/12">Deletion is not reversible, and the story will be completely deleted. If you do not want to delete, you can unlist the story.</p>
                        <div className="modal-action justify-center items-center gap-2 md:gap-4">
                            <form method="dialog">
                                {/* if there is a button, it will close the modal */}
                                <button className="btn btn-outline btn-sm md:btn-md">Cancel</button>
                            </form>
                            <button disabled={isDeleting} onClick={() => {
                                const deleteRequest = { id: articleId };
                                handleDelete({ deleteRequest }, {
                                    onSuccess: () => {
                                        const modal = document.getElementById('my_modal_3');
                                        if (modal instanceof HTMLDialogElement) {
                                            modal.close();
                                        }
                                        navigate({ to: homeRoute.to });
                                    }
                                });
                            }} className="btn btn-error btn-sm md:btn-md">Delete</button>
                        </div>
                    </div>
                </dialog>
                <EditorComponent
                    editor={editor}
                    editable={false}
                />
            </>}
        </>
    );
}