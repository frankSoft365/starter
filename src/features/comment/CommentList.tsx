import Loading from "@/ui/Loading"
import CommentItem from "./CommentItem";
import { useGetInfiniteRootCommentList, useReplyCommentForm } from "./comment";
import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "@/ui/Avatar";
import FieldInfo from "@/ui/FieldInfo";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import ReplyList from "./ReplyList";
import { getRootCommentAndContextById } from "@/services/apiComment";
import type { CommentThreadDTO, CursorPage, CursorPageRequest } from "@/types/comment";
import { useQueryClient } from "@tanstack/react-query";

export type ActiveReplyTarget = {
    rootId: string;
    replyToUsername: string;
    parentId: string;
}

export default function CommentList({
    articleId,
    authorId,
}: {
    articleId: string,
    authorId: string
}) {
    const user = useAtomValue(userAtom);
    const queryClient = useQueryClient();

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

    const [pinnedComment, setPinnedComment] = useState<CommentThreadDTO | null>(null);
    const targetReplyId = useMemo(() => {
        const hash = window.location.hash;
        const match = hash.match(/^#reply(\d+)$/);
        return match ? match[1] : null;
    }, []);
    const hasFetchedPin = useRef(false);

    useEffect(() => {
        if (!targetReplyId || hasFetchedPin.current) {
            return;
        }
        if (status !== 'success') {
            return;
        }
        hasFetchedPin.current = true;
        async function fetchPinnedComment() {
            if (targetReplyId) {
                const commentThreadDTO = await getRootCommentAndContextById({ replyId: targetReplyId });

                queryClient.setQueryData(
                    ['get-comment', articleId],
                    (old: { pages: CursorPage<CommentThreadDTO>[]; pageParams: CursorPageRequest[] } | undefined) => {
                        if (!old) return old

                        // is root comment
                        const [firstPage, ...restPages] = old.pages
                        const updatedFirstPage = {
                            ...firstPage,
                            items: [commentThreadDTO, ...firstPage.items], // prepend
                        }
                        return {
                            ...old,
                            pages: [updatedFirstPage, ...restPages],
                        }
                    }
                );
                setPinnedComment(commentThreadDTO);
            }
        }
        fetchPinnedComment();
    }, [targetReplyId, status]);

    useEffect(() => {
        const handleVisible = () => {
            if (document.visibilityState === 'visible') {
                location.reload();
            }
        }
        document.addEventListener('visibilitychange', handleVisible);
        return () => document.removeEventListener('visibilitychange', handleVisible);
    }, []);

    useEffect(() => {
        if (pinnedComment) {
            setTimeout(() => {
                const el = document.getElementById(`pinned-comment-${pinnedComment.root.id}`);
                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 0);
        }
    }, [pinnedComment]);

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

                        {/* normal comment list */}
                        {data.pages.flatMap((page) => page.items).map((comment) => {
                            const rootComment = comment.root;
                            if (pinnedComment && rootComment.id === pinnedComment.root.id && !comment.pinned) {
                                return null;
                            }
                            return (
                                <div key={rootComment.id} id={`rootComment-area-${rootComment.id}`}>
                                    <div id={comment.pinned ? `pinned-comment-${rootComment.id}` : ''} className={comment.root.id === targetReplyId ? 'animate-highlight-fade' : ''} >
                                        <CommentItem
                                            avatarUrl={rootComment.userAvatar || ''}
                                            username={rootComment.username || ''}
                                            isAuthor={authorId === rootComment.userId}
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
                                    </div>

                                    {/* all replies list */}
                                    <ReplyList
                                        articleId={articleId}
                                        authorId={authorId}
                                        commentThreadDTO={comment}
                                        setActiveReplyTarget={setActiveReplyTarget}
                                        targetReplyId={targetReplyId}
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