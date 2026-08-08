import { addComment, getRepliesForRootComment, getRootComments } from "@/services/apiComment";
import { getLikeBatchStatus, likeAction } from "@/services/apiLike";
import type { CommentThreadDTO, CommentView, CreateCommentRequest, CursorPage, CursorPageRequest } from "@/types/comment";
import { useForm, useStore } from "@tanstack/react-form";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { ActiveReplyTarget } from "./CommentList";
import { CreateCommentSchema, type CreateCommentForm } from "@/schemas/comment";
import i18n from "@/i18n";

export function useGetInfiniteRootCommentList(articleId: string) {
    return useInfiniteQuery({
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
}

export function useReplyCommentForm(articleId: string) {
    const {
        handleAddComment,
        isAddingComment
    } = useAddComment(articleId);

    const [activeReplyTarget, setActiveReplyTarget] =
        useState<ActiveReplyTarget | null>(null);

    const defaultValues: CreateCommentForm = {
        commentContent: ''
    };

    const replyForm = useForm({
        defaultValues,
        onSubmit: ({ value }) => {
            if (!activeReplyTarget) {
                return;
            }
            handleAddComment({
                params: {
                    content: value.commentContent,
                    parentId: activeReplyTarget.parentId
                }
            }, {
                onSuccess: () => {
                    replyForm.resetField('commentContent');
                    setActiveReplyTarget(null);
                },
            });
        },
        validators: {
            onChange: CreateCommentSchema,
            onSubmit: CreateCommentSchema,
        },
    });

    const replyCanSubmit = useStore(replyForm.store, (state) => state.canSubmit);

    return ({
        isAddingComment,
        activeReplyTarget,
        setActiveReplyTarget,
        replyForm,
        replyCanSubmit
    });

}

export function useGetRepliesForRoot(articleId: string, rootId: string, enabled: boolean) {
    return useInfiniteQuery({
        queryKey: ['get-comments', 'replies', rootId],
        queryFn: async ({ pageParam }: { pageParam: CursorPageRequest }) => {
            return await getRepliesForRootComment({
                params: pageParam,
                articleId,
                rootId
            });
        },
        initialPageParam: { lastCreatedAt: null, lastId: null } as CursorPageRequest,
        getNextPageParam: (lastPage) => {
            if (lastPage.hasMore) {
                return {
                    lastCreatedAt: lastPage.nextCursorCreatedAt,
                    lastId: lastPage.nextCursorId
                }
            }
            return undefined;
        },
        enabled,
    });
}

export function useAddComment(articleId: string) {
    const queryClient = useQueryClient();

    const { mutate: handleAddComment, isPending: isAddingComment } = useMutation({
        mutationFn: async ({ params }: {
            params: CreateCommentRequest,
            rootId?: string
        }) => {
            const { commentView: newCommentView, rootId } = await addComment({ params, articleId });
            return {
                newCommentView,
                rootId
            }
        },
        onSuccess: ({ newCommentView, rootId }) => {
            queryClient.setQueryData(
                ['get-comment', articleId],
                (old: { pages: CursorPage<CommentThreadDTO>[]; pageParams: CursorPageRequest[] } | undefined) => {
                    if (!old) return old

                    // is root comment
                    if (!rootId) {
                        const [firstPage, ...restPages] = old.pages
                        const newCommentThreadDTO = {
                            root: newCommentView,
                            replyPreview: [] as CommentView[],
                            totalReplyCount: 0,
                            hasMoreReplies: false
                        } as CommentThreadDTO;
                        const updatedFirstPage = {
                            ...firstPage,
                            items: [newCommentThreadDTO, ...firstPage.items], // prepend
                        }
                        return {
                            ...old,
                            pages: [updatedFirstPage, ...restPages],
                        }
                    } else {    // is reply comment
                        const newPages = old.pages.map((cursorPage) => {
                            let changed = false;
                            const commentThreadDTOs = cursorPage.items;
                            const newCommentThreadDTOs = commentThreadDTOs.map((commentThreadDTO) => {
                                if (commentThreadDTO.root.id === rootId) {
                                    changed = true;
                                    return {
                                        ...commentThreadDTO,
                                        replyPreview: [
                                            ...commentThreadDTO.replyPreview,
                                            newCommentView
                                        ],
                                        totalReplyCount: commentThreadDTO.totalReplyCount + 1
                                    }
                                }
                                return commentThreadDTO;
                            });
                            return changed ? {
                                ...cursorPage,
                                items: newCommentThreadDTOs
                            }
                                : cursorPage;
                        })
                        return {
                            ...old,
                            pages: newPages
                        }
                    }

                }
            );
            // full reply query
            queryClient.setQueryData(
                ['get-comments', 'replies', rootId],
                (old: { pages: CursorPage<CommentView>[]; pageParams: CursorPageRequest[] } | undefined) => {
                    if (!old) return old
                    const lastPageIndex = old.pages.length - 1
                    const lastPage = old.pages[lastPageIndex]

                    if (lastPage.hasMore) {
                        return old // new reply will arrive naturally via future fetchNextPage()
                    }

                    const newLastPage: CursorPage<CommentView> = {
                        ...lastPage,
                        items: [...lastPage.items, newCommentView],
                        nextCursorCreatedAt: newCommentView.createdAt,
                        nextCursorId: newCommentView.id,
                    }

                    return {
                        ...old,
                        pages: old.pages.map((page, i) => (i === lastPageIndex ? newLastPage : page)),
                    }
                }
            );
            toast.success(i18n.t('common.toast.replyPosted'));
        },
        onError: (error) => {
            toast.error(error.message || i18n.t('common.toast.publishError'));
        }
    })

    return ({
        handleAddComment,
        isAddingComment
    });
}

/**
 * Batch query like status for a set of comment IDs.
 * `scope` distinguishes root-comment queries from reply queries.
 * When commentIds change (e.g. infinite scroll loads more), the queryKey
 * changes and TanStack Query automatically refetches with the full ID set.
 */
export function useCommentLikeStatus(
    scope: string,
    commentIds: string[],
    enabled: boolean,
) {
    return useQuery({
        queryKey: ['get-like-status', 'comment', scope, commentIds],
        queryFn: async () => {
            const res = await getLikeBatchStatus({ targetType: 2, targetIds: commentIds });
            return res.likedMap;
        },
        enabled: enabled && commentIds.length > 0,
    });
}

export function useLikeComment(articleId: string) {
    const queryClient = useQueryClient();

    const { mutate: toggleLike, isPending, variables } = useMutation({
        mutationFn: async ({ commentId, action }: { commentId: string; action: 1 | 2 }) => {
            await likeAction({ targetType: 2, targetId: commentId, action });
        },
        onMutate: async ({ commentId, action }) => {
            // Snapshot like-status queries for rollback
            const likeStatusQueries = queryClient.getQueriesData<Record<string, boolean>>(
                { queryKey: ['get-like-status', 'comment'] }
            );

            // Optimistic: flip like status in all matching queries
            queryClient.setQueriesData<Record<string, boolean>>(
                { queryKey: ['get-like-status', 'comment'] },
                (old) => {
                    if (!old) return old;
                    return { ...old, [commentId]: action === 1 };
                }
            );

            const delta = action === 1 ? 1 : -1;

            // Optimistic: update likeCount in root-comment cache (root + replyPreview)
            queryClient.setQueryData(
                ['get-comment', articleId],
                (old: { pages: CursorPage<CommentThreadDTO>[]; pageParams: CursorPageRequest[] } | undefined) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map(page => ({
                            ...page,
                            items: page.items.map(thread => {
                                // root comment
                                if (thread.root.id === commentId) {
                                    return {
                                        ...thread,
                                        root: { ...thread.root, likeCount: thread.root.likeCount + delta },
                                    };
                                }
                                // reply in replyPreview
                                if (thread.replyPreview.some(r => r.id === commentId)) {
                                    return {
                                        ...thread,
                                        replyPreview: thread.replyPreview.map(r =>
                                            r.id === commentId
                                                ? { ...r, likeCount: r.likeCount + delta }
                                                : r
                                        ),
                                    };
                                }
                                return thread;
                            }),
                        })),
                    };
                }
            );

            // Optimistic: update likeCount in expanded-replies cache
            queryClient.setQueriesData<{ pages: CursorPage<CommentView>[]; pageParams: CursorPageRequest[] }>(
                { queryKey: ['get-comments', 'replies'] },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map(page => ({
                            ...page,
                            items: page.items.map(reply =>
                                reply.id === commentId
                                    ? { ...reply, likeCount: reply.likeCount + delta }
                                    : reply
                            ),
                        })),
                    };
                }
            );

            return { likeStatusQueries };
        },
        onError: (error, _vars, context) => {
            // Rollback like-status queries
            if (context?.likeStatusQueries) {
                context.likeStatusQueries.forEach(([key, data]) => {
                    queryClient.setQueryData(key, data);
                });
            }
            // Refetch comment caches to restore correct likeCount
            queryClient.invalidateQueries({ queryKey: ['get-comment', articleId] });
            queryClient.invalidateQueries({ queryKey: ['get-comments', 'replies'] });
            toast.error(error.message);
        },
    });

    return { toggleLike, isPending, variables };
}