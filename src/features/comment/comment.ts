import { addComment, getRepliesForRootComment, getRootComments } from "@/services/apiComment";
import type { CommentThreadDTO, CommentView, CreateCommentRequest, CursorPage, CursorPageRequest } from "@/types/comment";
import { useForm, useStore } from "@tanstack/react-form";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { ActiveReplyTarget } from "./CommentList";
import { CreateCommentSchema, type CreateCommentForm } from "@/schemas/comment";

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
    const queryClient = useQueryClient()

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
            toast.success('Reply posted — view the full thread to see it.');
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while publishing the article.');
        }
    })

    return ({
        handleAddComment,
        isAddingComment
    });
}