import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import EditorComponent from "../ui/EditorComponent";
import Loading from "../ui/Loading";
import { useCreateBlockNote } from "@blocknote/react";
import { useUpdateArticle, useCurrentArticle } from "./article";
import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { editorUpdateSignalAtom } from "@/atoms/editor";
import { buildArticleContent, isEditorEmpty } from "@/utils/editorHelper";
import type { ArticleUpdateRequest } from "@/types/article";
import { useNavigate } from "@tanstack/react-router";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";

export default function ArticleEdit() {
    const navigate = useNavigate();
    const setEditorUpdateSignal = useSetAtom(editorUpdateSignalAtom);
    const { articleId } = articleEditRoute.useParams();
    const editor = useCreateBlockNote();

    const { processedArticle, isLoading } = useCurrentArticle(articleId, editor, false);
    const article = processedArticle?.article;

    const editorUpdateSignal = useAtomValue(editorUpdateSignalAtom);

    const { handleUpdate } = useUpdateArticle();

    useEffect(() => {
        if (editorUpdateSignal && !isEditorEmpty(editor.document)) {
            const { content } = buildArticleContent(editor);
            const request: ArticleUpdateRequest = {
                articleId,
                content
            }
            handleUpdate({ request }, {
                onSuccess: () => {
                    setEditorUpdateSignal(0);
                    navigate({ to: articleRoute.to, params: { articleId: articleId } })
                }
            });
        }
    }, [editorUpdateSignal]);

    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && article && <>
                <EditorComponent
                    editor={editor}
                />
            </>}
        </>
    );
}