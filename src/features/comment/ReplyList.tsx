import { useState } from "react";
import { useGetRepliesForRoot } from "./comment";
import type { CommentThreadDTO } from "@/types/comment";
import CommentItem from "./CommentItem";
import type { ActiveReplyTarget } from "./CommentList";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

export default function ReplyList({
    articleId,
    authorId,
    commentThreadDTO,
    setActiveReplyTarget,
    targetReplyId = null
}: {
    articleId: string,
    authorId: string,
    commentThreadDTO: CommentThreadDTO,
    setActiveReplyTarget: (value: ActiveReplyTarget | null) => void,
    targetReplyId?: string | null
}) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const totalReplyCount = commentThreadDTO.totalReplyCount;
    const rootComment = commentThreadDTO.root;
    const repliesPreview = commentThreadDTO.replyPreview;

    // view replies of one root comment
    // replies are expanded or collapsed
    const [expanded, setExpanded] = useState(false)
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useGetRepliesForRoot(articleId, rootComment.id, expanded);

    return (
        <>
            {/* reply preview */}
            {repliesPreview.length > 0 && !expanded && (
                <div className="ml-5 border-gray-200 bg-base-200 pl-1 rounded-2xl">
                    {repliesPreview.map(reply => (
                        <div key={reply.id} className={`space-y-2 ${targetReplyId && reply.id === targetReplyId ? 'animate-highlight-fade' : ''}`}>
                            <CommentItem
                                avatarUrl={reply.userAvatar || ''}
                                username={reply.username || ''}
                                isAuthor={authorId === reply.userId}
                                replyToUsername={rootComment.id !== reply.parentId ? reply.replyToUsername : null}
                                createdAt={new Date(reply.createdAt).toLocaleString()}
                                body={reply.content}
                                likes={0}
                                size="sm"
                                onReply={() => {
                                    setActiveReplyTarget({ rootId: rootComment.id, replyToUsername: reply.username ?? '', parentId: reply.id });
                                    setTimeout(() => {
                                        const el = document.getElementById(`reply-textarea-${rootComment.id}`);
                                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 0);
                                }}
                            />

                        </div>
                    ))}
                </div>
            )}
            {!expanded && totalReplyCount > 0 && <li
                onClick={() => {
                    setExpanded(true);
                    setActiveReplyTarget(null);
                }}
                className="list-row w-full p-4 text-blue-400 hover:text-blue-600 cursor-pointer">
                {t('comment.expand', { count: totalReplyCount })}
            </li>}
            {/* full reply list */}
            {expanded && status === 'pending' && <div className="ml-5 border-gray-200 bg-base-200 pl-1 rounded-2xl flex h-24 items-center justify-center gap-2"><span className="loading loading-spinner"></span><span>{t('common.loading')}</span></div>}
            {status === 'error' && (
                <div className="ml-5 flex flex-col items-center gap-2 p-4">
                    <p className="text-red-500">{t('common.error')}: {error.message}</p>
                    <button onClick={() => queryClient.invalidateQueries({ queryKey: ['get-comments', 'replies', rootComment.id] })} className="btn btn-sm btn-outline">
                        {t('common.retry')}
                    </button>
                </div>
            )}
            {status === 'success' && expanded ?
                <div className="ml-5 border-gray-200 bg-base-200 pl-1 rounded-2xl">
                    {data.pages.flatMap(page => page.items).map(reply => (
                        <div key={reply.id} className="space-y-2">
                            <CommentItem
                                avatarUrl={reply.userAvatar || ''}
                                username={reply.username || ''}
                                isAuthor={authorId === reply.userId}
                                replyToUsername={rootComment.id !== reply.parentId ? reply.replyToUsername : null}
                                createdAt={new Date(reply.createdAt).toLocaleString()}
                                body={reply.content}
                                likes={0}
                                size="sm"
                                onReply={() => {
                                    setActiveReplyTarget({ rootId: rootComment.id, replyToUsername: reply.username ?? '', parentId: reply.id });
                                    setTimeout(() => {
                                        const el = document.getElementById(`reply-textarea-${rootComment.id}`);
                                        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }, 0);
                                }}
                            />

                        </div>
                    ))}
                    {isFetchingNextPage && <li className="list-row">{t('common.loading')}</li>}
                    {!hasNextPage && <li className="list-row text-center p-5">{t('comment.noMoreComment')}</li>}
                    {hasNextPage && <li
                        onClick={() => fetchNextPage()}
                        className="list-row w-full p-4 text-blue-400 hover:text-blue-600 cursor-pointer">
                        {isFetching ? t('common.loading') : t('comment.showMore')}
                    </li>}
                    <li
                        onClick={() => {
                            setExpanded(false);
                            setActiveReplyTarget(null);
                            setTimeout(() => {
                                const el = document.getElementById(`rootComment-area-${rootComment.id}`);
                                el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 0);
                        }}
                        className="list-row w-full p-4 text-blue-400 hover:text-blue-600 cursor-pointer">
                        {t('comment.collapse')}
                    </li>
                </div>
                : null}
        </>
    );
}