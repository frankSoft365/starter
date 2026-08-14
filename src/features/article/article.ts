import { deleteArticle, getArticleById, updateArticle } from "@/services/apiArticle";
import { getLikeBatchStatus, likeAction } from "@/services/apiLike";
import type { BlockNoteEditor } from "@blocknote/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ArticlePublishPreview, ArticlePublishRequest, ArticleUpdateRequest, ArticleVO } from "../../types/article";
import { useSetAtom } from "jotai";
import { editorPublishSignalAtom } from "../../atoms/editor";
import { publishArticle } from "../../services/apiArticle";
import { getTitle } from "@/utils/editorHelper";
import { useNavigate } from "@tanstack/react-router";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import type { DeleteRequest } from "@/types/DeleteRequest";
import type { ArticleSubmissionForm } from "@/schemas/article";
import { useState } from "react";

export function useArticlePublish(articlePreview: ArticlePublishPreview | null) {
    const navigate = useNavigate();
    const setEditorPublishSignal = useSetAtom(editorPublishSignalAtom);

    const { mutate: handlePublish, isPending: isPublishing } = useMutation({
        mutationKey: ['publish-article'],
        mutationFn: async ({ value }: { value: ArticleSubmissionForm }) => {
            if (!articlePreview) {
                throw new Error('No article submission content.');
            }
            const content = articlePreview.content;
            const coverImage = value.coverImage;
            const coverFocusY = value.coverFocusY;
            const title = value.title;
            const subtitle = value.subtitle;
            const topics = value.topics;

            const publishRequest: ArticlePublishRequest = {
                title,
                ...(subtitle && { subtitle }),
                content,
                ...(coverImage && { coverImage }),
                ...(coverFocusY && { coverFocusY }),
                topics,
                status: 'published',
                // publishAt: null
            }
            const articleId = await publishArticle(publishRequest);
            return articleId;
        },
        onSuccess(articleId) {
            toast.success('Article published successfully.');
            setEditorPublishSignal(pre => pre + 1);
            navigate({ to: articleRoute.to, params: { articleId: articleId } })
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while publishing the article.');
        }
    });

    return ({
        handlePublish,
        isPublishing,
    });

}

export function useDeleteArticle() {
    const queryClient = useQueryClient();
    const { mutate: handleDelete, isPending: isDeleting } = useMutation({
        mutationKey: ['delete-article'],
        mutationFn: async ({ deleteRequest }: { deleteRequest: DeleteRequest }) => {
            await deleteArticle(deleteRequest);
        },
        onSuccess() {
            toast.success('Article deleted successfully.');
            queryClient.invalidateQueries({ queryKey: ['get-article-list'] });
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while publishing the article.');
        }
    });

    return ({
        handleDelete,
        isDeleting,
    });
}

export function useUpdateArticle() {
    const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
        mutationKey: ['update-article'],
        mutationFn: async ({ request }: { request: ArticleUpdateRequest }) => {
            if (!request) {
                throw new Error('No article update content.');
            }
            await updateArticle(request);
        },
        onSuccess() {
            toast.success('Article updated successfully.');
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while publishing the article.');
        }
    });

    return ({
        handleUpdate,
        isUpdating,
    });
}

export function useCurrentArticle(articleId: string, editor: BlockNoteEditor, detail = true) {
    const { data: processedArticle, isLoading, isError, error } = useQuery({
        queryKey: ['get-article', articleId],
        queryFn: async () => {
            const article = await getArticleById(articleId);
            const content = JSON.parse(article.content);
            let title = '';
            if (detail) {
                title = getTitle(editor, content);
                const [_headingBlock, ...bodyBlock] = content;
                const body = bodyBlock;
                editor.replaceBlocks(editor.document, body);
            } else {
                editor.replaceBlocks(editor.document, content);
            }
            return ({
                title,
                article
            });
        },
    });

    return ({
        processedArticle,
        isLoading,
        isError,
        error
    });
}

export function useChangeCoverImage(coverImages: string[] | undefined) {
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

    const [newImage, setNewImage] = useState(coverImages?.[0]);

    return ({
        newImage,
        setNewImage,
        isAdjustModalOpen,
        setIsAdjustModalOpen
    });
}

export function useLikeStatus(articleId: string, enabled: boolean) {
    return useQuery({
        queryKey: ['get-like-status', 'article', articleId],
        queryFn: async () => {
            const res = await getLikeBatchStatus({ targetType: 1, targetIds: [articleId] });
            return res.likedMap[articleId] ?? false;
        },
        enabled,
    });
}

export function useLikeArticle(articleId: string) {
    const queryClient = useQueryClient();
    const likeStatusKey = ['get-like-status', 'article', articleId];
    const articleKey = ['get-article', articleId];

    const { mutate: toggleLike, isPending: isLiking } = useMutation({
        mutationFn: async ({ action }: { action: 1 | 2 }) => {
            await likeAction({ targetType: 1, targetId: articleId, action });
        },
        onMutate: async ({ action }) => {
            const newLiked = action === 1;
            const previousLiked = !newLiked;

            await queryClient.cancelQueries({ queryKey: likeStatusKey });

            queryClient.setQueryData<boolean>(likeStatusKey, newLiked);

            queryClient.setQueryData<{ title: string; article: ArticleVO } | undefined>(
                articleKey,
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        article: {
                            ...old.article,
                            likeCount: old.article.likeCount + (newLiked ? 1 : -1),
                        },
                    };
                }
            );

            return { previousLiked };
        },
        onError: (error, _vars, context) => {
            if (context) {
                queryClient.setQueryData(likeStatusKey, context.previousLiked);
                queryClient.setQueryData<{ title: string; article: ArticleVO } | undefined>(
                    articleKey,
                    (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            article: {
                                ...old.article,
                                likeCount: old.article.likeCount + (context.previousLiked ? 1 : -1),
                            },
                        };
                    }
                );
            }
            toast.error(error.message);
        },
    });

    return { toggleLike, isLiking };
}