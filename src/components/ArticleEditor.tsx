import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useEditor } from "./editor";
import { useDraft } from "./draft";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { editorPublishSignalAtom } from "../atoms/editor";
import { isEditorEmpty } from "../utils/editorHelper";
import { useArticlePublish } from "./articlePublish";

export default function ArticleEditor() {
    const { draft, setDraft, saveDraft } = useDraft();
    const { editor, handleEditorChange, resetEditor } = useEditor(draft, saveDraft, setDraft);
    const [editorPublishSignal, setEditorPublishSignal] = useAtom(editorPublishSignalAtom);
    const { handlePublish } = useArticlePublish(editor);

    useEffect(() => {
        if (editorPublishSignal && !isEditorEmpty(editor.document)) {
            handlePublish({}, {
                onSuccess: () => {
                    resetEditor();
                    setEditorPublishSignal(0);
                }
            });
        }
    }, [editorPublishSignal]);

    return (
        <BlockNoteView
            editor={editor}
            onChange={handleEditorChange}
        />
    );
}