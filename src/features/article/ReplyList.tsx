import { useState } from "react";
import { useGetRepliesForRoot } from "./comment";
import type { CommentThreadDTO } from "@/types/comment";
import CommentItem from "./CommentItem";
import type { ActiveReplyTarget } from "./CommentList";

export default function ReplyList({
    articleId,
    commentThreadDTO,
    setActiveReplyTarget
}: {
    articleId: string,
    commentThreadDTO: CommentThreadDTO,
    setActiveReplyTarget: (value: ActiveReplyTarget | null) => void
}) {
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
                        <div key={reply.id} className="space-y-2">
                            <CommentItem
                                avatarUrl={reply.userAvatar || ''}
                                username={reply.username || ''}
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
            {!expanded && totalReplyCount > 3 && <li
                onClick={() => {
                    setExpanded(true);
                    setActiveReplyTarget(null);
                }}
                className="list-row w-full p-4 text-blue-400 hover:text-blue-600 cursor-pointer">
                total {totalReplyCount} replies, click to expand
            </li>}
            {/* full reply list */}
            {expanded && status === 'pending' && <div className="w-full h-8 flex items-center justify-center"><span className="loading loading-spinner"></span></div>}
            {status === 'error' && <p>Error: {error.message}</p>}
            {status === 'success' && expanded ?
                <div className="ml-5 border-gray-200 bg-base-200 pl-1 rounded-2xl">
                    {data.pages.flatMap(page => page.items).map(reply => (
                        <div key={reply.id} className="space-y-2">
                            <CommentItem
                                avatarUrl={reply.userAvatar || ''}
                                username={reply.username || ''}
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
                    {isFetchingNextPage && <li className="list-row">Loading...</li>}
                    {!hasNextPage && <li className="list-row text-center p-5">No more comments.</li>}
                    {hasNextPage && <li
                        onClick={() => fetchNextPage()}
                        className="list-row w-full p-4 text-blue-400 hover:text-blue-600 cursor-pointer">
                        {isFetching ? 'Loading...' : 'Show more replies'}
                    </li>}
                    <li
                        onClick={() => {
                            setExpanded(false);
                            setActiveReplyTarget(null);
                        }}
                        className="list-row w-full p-4 text-blue-400 hover:text-blue-600 cursor-pointer">
                        Click to collapse
                    </li>
                </div>
                : null}
        </>
    );
}