import { useMutation } from "@tanstack/react-query";
import { publishArticle } from "../services/apiArticle";
import { toast } from "sonner";
import { buildArticleInsert } from "../utils/editorHelper";
import type { BlockNoteEditor } from "@blocknote/core";


export function useArticlePublish(editor: BlockNoteEditor) {
    const { mutate: handlePublish, isPending: isPublishing } = useMutation({
        mutationKey: ['publish-article'],
        mutationFn: async (_value: any) => {
            const insertArticle = buildArticleInsert(editor);
            await publishArticle(insertArticle);
        },
        onSuccess() {
            toast.success('Article published successfully.');
        },
        onError: (error) => {
            toast.error(error.message || 'An error occurred while publishing the article.');
        }
    });

    return ({
        handlePublish,
        isPublishing
    });

}