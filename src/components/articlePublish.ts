import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ArticlePublishPreview, ArticlePublishRequest } from "../types/article";
import { useSetAtom } from "jotai";
import { editorPublishSignalAtom } from "../atoms/editor";
import type { PreviewSchema } from "./Submission";
import { publishArticle } from "../services/apiArticle";

export function useArticlePublish(articlePreview: ArticlePublishPreview | null) {
    const setEditorPublishSignal = useSetAtom(editorPublishSignalAtom);
    const { mutate: handlePublish, isPending: isPublishing } = useMutation({
        mutationKey: ['publish-article'],
        mutationFn: async (value: PreviewSchema) => {
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
            await publishArticle(publishRequest);
        },
        onSuccess() {
            toast.success('Article published successfully.');
            setEditorPublishSignal(pre => pre + 1);
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