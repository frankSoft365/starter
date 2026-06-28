import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import EditorComponent from "@/ui/EditorComponent";
import Loading from "@/ui/Loading";
import { useCreateBlockNote } from "@blocknote/react";
import { useUpdateArticle, useCurrentArticle } from "./article";
import { useEffect, useRef } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { editorUpdateSignalAtom } from "@/atoms/editor";
import { buildArticleContent, isEditorEmpty } from "@/utils/editorHelper";
import type { ArticleUpdateRequest } from "@/types/article";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import { isDirtyAtom } from "@/atoms/article";

export default function ArticleEdit() {
    const navigate = useNavigate();
    const setEditorUpdateSignal = useSetAtom(editorUpdateSignalAtom);
    const { articleId } = articleEditRoute.useParams();
    const editor = useCreateBlockNote();

    const { processedArticle, isLoading } = useCurrentArticle(articleId, editor, false);
    const article = processedArticle?.article;

    const editorUpdateSignal = useAtomValue(editorUpdateSignalAtom);

    const { handleUpdate } = useUpdateArticle();

    const [isDirty, setIsDirty] = useAtom(isDirtyAtom);
    const isSkipBlocker = useRef(false);

    // save initial article content 
    const initialContent = useRef<string | null>(null);
    useEffect(() => {
        setIsDirty(false);
        if (!isLoading && article) {
            initialContent.current = article.content;
        }
    }, [isLoading, article]);

    function handleEditorChange(changedEditor: typeof editor) {
        if (!initialContent.current) {
            return;
        }
        const currentContent = buildArticleContent(changedEditor).content;
        if (initialContent.current !== currentContent) {
            setIsDirty(true);
        }
    }

    // Jump Block
    useBlocker({
        shouldBlockFn: () => {
            if (!isDirty || isSkipBlocker.current) {
                return false;
            }
            const shouldBlock = !window.confirm('You have unsaved changes, are you sure you want to leave?');
            return shouldBlock;
        },
    });

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
                    isSkipBlocker.current = true;
                    navigate({ to: articleRoute.to, params: { articleId: articleId } });
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
                    onChange={handleEditorChange}
                />
            </>}
        </>
    );
}