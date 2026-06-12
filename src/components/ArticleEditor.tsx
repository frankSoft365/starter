import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { debounce } from 'es-toolkit/function';
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useDraft } from "./draft";
import { useEffect } from "react";
import { isEditorEmptyHelper } from "../utils/isEditorEmptyHelper";
import { useAtom } from "jotai";
import { isEditorEmptyAtom } from "../stores/isEditorEmpty";
import { EDITOR_DEFAULT } from "../constants/draft";

export default function ArticleEditor() {
    const { draft, setDraft } = useDraft();
    const [isEditorEmpty, setIsEditorEmpty] = useAtom(isEditorEmptyAtom);

    const editor = useCreateBlockNote(
        {
            autofocus: 'end',
            initialContent: draft
        },
        []
    );

    const saveDraft = debounce((document) => {
        if (isEditorEmptyHelper(editor.document)) {
            setIsEditorEmpty(true);
            setDraft(EDITOR_DEFAULT);
            return;
        }
        setIsEditorEmpty(false);
        setDraft(document);
    }, 500);

    useEffect(() => {
        if (!isEditorEmptyHelper(editor.document)) {
            setIsEditorEmpty(false)
        }
        return () => {
            saveDraft.cancel();
            saveDraft.flush();
        }
    }, []);

    useEffect(() => {
        if (isEditorEmpty) {
            setDraft(EDITOR_DEFAULT);
            editor.replaceBlocks(editor.document, EDITOR_DEFAULT);
        }
    }, [isEditorEmpty]);

    return (
        <BlockNoteView editor={editor} onChange={(editor) => saveDraft(editor.document)} />
    );
}