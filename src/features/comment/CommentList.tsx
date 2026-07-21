import Loading from "@/ui/Loading"
import CommentItem from "./CommentItem";
import { useGetInfiniteRootCommentList, useReplyCommentForm } from "./comment";
import { useEffect, useRef } from "react";
import Avatar from "@/ui/Avatar";
import FieldInfo from "@/ui/FieldInfo";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import ReplyList from "./ReplyList";

export type ActiveReplyTarget = {
    rootId: string;
    replyToUsername: string;
    parentId: string;
}

export default function CommentList({
    articleId
}: {
    articleId: string
}) {
    const user = useAtomValue(userAtom);

    const {
        isAddingComment,
        activeReplyTarget,
        setActiveReplyTarget,
        replyForm,
        replyCanSubmit
    } = useReplyCommentForm(articleId);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useGetInfiniteRootCommentList(articleId);

    // auto fetch comment list
    const commentListBottomRef = useRef<HTMLLIElement | null>(null);
    useEffect(() => {
        const ref = commentListBottomRef.current;
        if (!ref) {
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && hasNextPage && !isFetching) {
                fetchNextPage();
            }
        }, { rootMargin: '200px' });
        observer.observe(ref);
        return () => observer.disconnect();
    }, [hasNextPage, isFetching, fetchNextPage]);

    return (
        <div className="w-full lg:w-4xl mx-auto">
            {status === 'pending' && <Loading />}
            {status === 'error' && <p>Error: {error.message}</p>}
            {status === 'success' && data.pages.flatMap((page) => page.items).length > 0
                ? (
                    <ul className="list bg-base-100">
                        {data.pages.flatMap((page) => page.items).map((comment) => {
                            const rootComment = comment.root;
                            return (
                                <div key={rootComment.id} id={`rootComment-area-${rootComment.id}`}>
                                    <CommentItem
                                        avatarUrl={rootComment.userAvatar || ''}
                                        username={rootComment.username || ''}
                                        createdAt={new Date(rootComment.createdAt).toLocaleString()}
                                        body={rootComment.content}
                                        likes={0}
                                        onReply={() => {
                                            setActiveReplyTarget({ rootId: rootComment.id, replyToUsername: rootComment.username ?? '', parentId: rootComment.id });
                                            setTimeout(() => {
                                                const el = document.getElementById(`reply-textarea-${rootComment.id}`);
                                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                            }, 0);
                                        }}
                                    />

                                    {/* all replies list */}
                                    <ReplyList
                                        articleId={articleId}
                                        commentThreadDTO={comment}
                                        setActiveReplyTarget={setActiveReplyTarget}
                                    />

                                    {activeReplyTarget?.rootId === rootComment.id && (
                                        <div id={`reply-textarea-${rootComment.id}`} className="w-full">
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                replyForm.handleSubmit();
                                            }} className="w-full bg-base-200 p-3 rounded-lg">

                                                <div className="flex flex-row items-center text-sm gap-1 my-3">
                                                    <Avatar imageUrl={user?.image ?? undefined} username={user?.username || ''} size="sm" />
                                                    <span className="ml-1.5">{user?.username}</span>
                                                </div>
                                                <replyForm.Field
                                                    name="commentContent"
                                                    children={(field) => (
                                                        <>
                                                            <textarea
                                                                placeholder={`Replying to @${activeReplyTarget.replyToUsername}`}
                                                                className="textarea w-full textarea-md lg:textarea-lg xl:textarea-xl"
                                                                value={field.state.value}
                                                                onBlur={field.handleBlur}
                                                                onChange={(e) => field.handleChange(e.target.value)}
                                                            />
                                                            <FieldInfo field={field} />
                                                        </>
                                                    )}
                                                />
                                                <div className="flex justify-end mt-2 gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-ghost btn-sm"
                                                        onClick={() => {
                                                            replyForm.resetField('commentContent');
                                                            setActiveReplyTarget(null);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        disabled={!replyCanSubmit || isAddingComment}
                                                        type="submit"
                                                        className="btn btn-sm btn-neutral"
                                                    >
                                                        {isAddingComment ? <span className="loading loading-spinner"></span> : 'Reply'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <li ref={commentListBottomRef} className="list-row h-0.5" aria-hidden ></li>
                        {isFetchingNextPage && <li className="list-row">Loading more…</li>}
                        {!hasNextPage && <li className="list-row text-center p-5">No more comments.</li>}
                    </ul>)
                : (
                    <div className="h-48 text-gray-500 text-center p-5">
                        There are currently no responses for this story. Be the first to respond.
                    </div>)
            }
        </div>
    )
}