import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { isEditorEmptyHelper } from "../utils/isEditorEmptyHelper";
import { EDITOR_DEFAULT } from "../constants/draft";
import { useEditor } from "./editor";
import { useAtomValue, useSetAtom } from "jotai";
import { editorEmptySignalAtom, isEditorEmptyAtom } from "../stores/editor";
import { useEffect } from "react";
import { useDraft } from "./draft";

export default function ArticleEditor() {
    const { draft, setDraft, saveDraft } = useDraft();

    const editorEmptySignal = useAtomValue(editorEmptySignalAtom);
    const setIsEditorEmpty = useSetAtom(isEditorEmptyAtom);

    const { editor, handleEditorChange } = useEditor(draft, saveDraft, setDraft);

    useEffect(() => {
        if (editorEmptySignal) {
            setDraft(EDITOR_DEFAULT);
            editor.replaceBlocks(editor.document, EDITOR_DEFAULT);
        }
    }, [editorEmptySignal]);

    useEffect(() => {
        if (!isEditorEmptyHelper(editor.document)) {
            setIsEditorEmpty(false)
        }
        return () => {
            saveDraft.cancel();
            saveDraft.flush();
        }
    }, []);

    return (
        <BlockNoteView
            editor={editor}
            onChange={handleEditorChange}
        />
    );
}