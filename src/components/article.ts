import { getArticleById } from "@/services/apiArticle";
import type { BlockNoteEditor } from "@blocknote/core";
import { useQuery } from "@tanstack/react-query";

export function useCurrentArticle(articleId: string, editor: BlockNoteEditor, isEdit = false) {
    const { data: article, isLoading } = useQuery({
        queryKey: ['article', articleId],
        queryFn: async () => {
            const article = await getArticleById(articleId);
            const content = isEdit ? [{ type: 'heading', content: article.title }, ...JSON.parse(article.content)] : JSON.parse(article.content);
            if (editor) editor.replaceBlocks(editor.document, content);
            return article;
        },
    });

    return ({
        article,
        isLoading
    });
}