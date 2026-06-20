import { type DebouncedFunction } from 'es-toolkit/function';
import { useAtom, useSetAtom } from "jotai";
import { editorEmptySignalAtom, isEditorEmptyAtom } from "../atoms/editor";
import { isEditorEmpty } from "../utils/editorHelper";
import { EDITOR_DEFAULT } from "../constants/draft";
import { useCreateBlockNote } from "@blocknote/react";
import { en } from "@blocknote/core/locales";
import type { PartialBlock } from '@blocknote/core';
import { useEffect } from 'react';

export function useEditor(
    draft: PartialBlock[] | undefined,
    saveDraft: DebouncedFunction<(document: any) => void>,
    setDraft: React.Dispatch<React.SetStateAction<PartialBlock[] | undefined>>
) {
    const locale = en;
    const setIsEditorEmpty = useSetAtom(isEditorEmptyAtom);
    const [editorEmptySignal, setEditorEmptySignal] = useAtom(editorEmptySignalAtom);


    let isRestoring = false;

    const editor = useCreateBlockNote({
        autofocus: 'end',
        initialContent: draft,
        dictionary: {
            ...locale,
            placeholders: {
                ...locale.placeholders,
                // We override the default placeholder
                default: "Tell your story",
                // We override the heading placeholder
                heading: "Title",
            },
        },
    }, []);

    function handleEditorChange(changedEditor: typeof editor) {
        if (isRestoring) {
            isRestoring = false;
            return;
        }

        if (isEditorEmpty(changedEditor.document)) {
            isRestoring = true;
            setIsEditorEmpty(true);
            saveDraft.cancel();
            setDraft(EDITOR_DEFAULT);
            editor.replaceBlocks(editor.document, EDITOR_DEFAULT);
            return;
        }
        saveDraft(changedEditor.document);
    }

    function resetEditor() {
        setIsEditorEmpty(true);
        setDraft(EDITOR_DEFAULT);
        saveDraft.cancel();
        editor.replaceBlocks(editor.document, EDITOR_DEFAULT);
    }

    useEffect(() => {
        if (!isEditorEmpty(editor.document)) {
            setIsEditorEmpty(false)
        }
        return () => {
            saveDraft.cancel();
            saveDraft.flush();
        }
    }, []);

    useEffect(() => {
        if (editorEmptySignal) {
            setDraft(EDITOR_DEFAULT);
            editor.replaceBlocks(editor.document, EDITOR_DEFAULT);
            setEditorEmptySignal(0);
        }
    }, [editorEmptySignal]);

    return ({
        editor,
        handleEditorChange,
        resetEditor
    });
}