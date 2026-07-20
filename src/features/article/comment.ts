import { addComment, getRepliesForRootComment } from "@/services/apiComment";
import type { CommentThreadDTO, CommentView, CreateCommentRequest, CursorPage, CursorPageRequest } from "@/types/comment";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

    const { mutate: handleAddComment, isPending: isAdding } = useMutation({
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
        isAdding
    });
}