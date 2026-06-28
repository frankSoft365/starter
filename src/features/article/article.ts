import { deleteArticle, getArticleById, updateArticle } from "@/services/apiArticle";
import type { BlockNoteEditor } from "@blocknote/core";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ArticlePublishPreview, ArticlePublishRequest, ArticleUpdateRequest } from "../../types/article";
import { useSetAtom } from "jotai";
import { editorPublishSignalAtom } from "../../atoms/editor";
import { publishArticle } from "../../services/apiArticle";
import { getTitle } from "@/utils/editorHelper";
import { useNavigate } from "@tanstack/react-router";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import type { DeleteRequest } from "@/types/DeleteRequest";
import type { ArticleSubmissionForm } from "@/schemas/article";

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
            const title = value.title;
            const subtitle = value.subtitle;
            const topics = value.topics;
            const publishRequest: ArticlePublishRequest = {
                title,
                ...(subtitle && { subtitle }),
                content,
                ...(coverImage && { coverImage }),
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
    const { mutate: handleDelete, isPending: isDeleting } = useMutation({
        mutationKey: ['delete-article'],
        mutationFn: async ({ deleteRequest }: { deleteRequest: DeleteRequest }) => {
            await deleteArticle(deleteRequest);
        },
        onSuccess() {
            toast.success('Article deleted successfully.');
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
    const { data: processedArticle, isLoading } = useQuery({
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
        isLoading
    });
}