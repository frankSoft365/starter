import { useEditor } from "./editor";
import { useDraft } from "./draft";
import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { articlePreviewAtom, editorPublishSignalAtom, editorSubmissionSignalAtom } from "../atoms/editor";
import { buildArticlePreview, isEditorEmpty } from "../utils/editorHelper";
import { useNavigate } from "@tanstack/react-router";
import { Route as submissionRoute } from "../routes/_app/_protected/submission";
import EditorComponent from "../ui/EditorComponent";

export default function ArticleEditor() {
    const { draft, setDraft, saveDraft } = useDraft();
    const { editor, handleEditorChange, resetEditor } = useEditor(draft, saveDraft, setDraft);
    const [editorSubmissionSignal, setEditorSubmissionSignal] = useAtom(editorSubmissionSignalAtom);
    const [editorPublishSignal, setEditorPublishSignal] = useAtom(editorPublishSignalAtom);

    const setArticlePreview = useSetAtom(articlePreviewAtom);

    const navigate = useNavigate();

    function getArticleSubmission() {
        const articlePreview = buildArticlePreview(editor);
        setArticlePreview(articlePreview);
    }

    useEffect(() => {
        if (editorSubmissionSignal && !isEditorEmpty(editor.document)) {
            getArticleSubmission();
            navigate({ to: submissionRoute.to });
            setEditorSubmissionSignal(0);
        }
    }, [editorSubmissionSignal]);

    useEffect(() => {
        if (editorPublishSignal && !isEditorEmpty(editor.document)) {
            resetEditor();
            setEditorPublishSignal(0);
        }
    }, [editorPublishSignal]);

    return (
        <EditorComponent editor={editor} onChange={handleEditorChange} />
    );
}