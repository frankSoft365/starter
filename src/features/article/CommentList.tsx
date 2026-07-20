import { getRootComments } from "@/services/apiComment";
import type { CursorPageRequest } from "@/types/comment";
import Loading from "@/ui/Loading"
import { useInfiniteQuery } from "@tanstack/react-query";
import CommentItem from "./CommentItem";
import { useForm, useStore } from "@tanstack/react-form";
import { CreateCommentSchema, type CreateCommentForm } from "@/schemas/comment";
import { useAddComment } from "./comment";
import { useEffect, useRef, useState } from "react";
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
    const commentListBottomRef = useRef<HTMLLIElement | null>(null);

    const [activeReplyTarget, setActiveReplyTarget] =
        useState<ActiveReplyTarget | null>(null);

    const {
        handleAddComment,
        isAdding
    } = useAddComment(articleId);

    const defaultValues: CreateCommentForm = {
        commentContent: ''
    };

    const replyForm = useForm({
        defaultValues,
        onSubmit: ({ value }) => {
            if (!activeReplyTarget) {
                return;
            }

            handleAddComment(
                {
                    params: {
                        content: value.commentContent,
                        parentId: activeReplyTarget.parentId
                    }
                },
                {
                    onSuccess: () => {
                        replyForm.resetField('commentContent');
                        setActiveReplyTarget(null);
                    },
                },
            );
        },
        validators: {
            onChange: CreateCommentSchema,
            onSubmit: CreateCommentSchema,
        },
    });
    const replyCanSubmit = useStore(replyForm.store, (state) => state.canSubmit);

    const {
        data,
        error: getCommentsError,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['get-comment', articleId],
        queryFn: async ({ pageParam }: { pageParam: CursorPageRequest }) => {
            return await getRootComments({ params: pageParam, articleId });
        },
        initialPageParam: { lastCreatedAt: null, lastId: null } as CursorPageRequest,
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore
                ?
                {
                    lastCreatedAt: lastPage.nextCursorCreatedAt,
                    lastId: lastPage.nextCursorId
                }
                : undefined;
        }
    });

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

    if (status === 'pending') {
        return <Loading />
    }
    if (status === 'error') {
        return <p>Error: {getCommentsError.message}</p>
    }

    const commentList = data.pages.flatMap((page) => page.items);

    return (
        <div className="w-full lg:w-4xl mx-auto">
            {commentList.length > 0
                ? (
                    <ul className="list bg-base-100">
                        {commentList.map((comment) => {
                            const rootComment = comment.root;
                            return (
                                <div key={rootComment.id}>
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
                                                        disabled={!replyCanSubmit || isAdding}
                                                        type="submit"
                                                        className="btn btn-sm btn-neutral"
                                                    >
                                                        {isAdding ? <span className="loading loading-spinner"></span> : 'Reply'}
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
                        {!hasNextPage && commentList.length > 0 && <li className="list-row text-center p-5">No more comments.</li>}
                    </ul>)
                : (
                    <div className="h-48 text-gray-500 text-center p-5">
                        There are currently no responses for this story. Be the first to respond.
                    </div>)
            }
        </div>
    )
}