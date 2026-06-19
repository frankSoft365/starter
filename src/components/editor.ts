import { type DebouncedFunction } from 'es-toolkit/function';
import { useSetAtom } from "jotai";
import { isEditorEmptyAtom } from "../stores/editor";
import { isEditorEmptyHelper } from "../utils/isEditorEmptyHelper";
import { EDITOR_DEFAULT } from "../constants/draft";
import { useCreateBlockNote } from "@blocknote/react";
import { en } from "@blocknote/core/locales";
import type { PartialBlock } from '@blocknote/core';

export function useEditor(
    draft: PartialBlock[] | undefined,
    saveDraft: DebouncedFunction<(document: any) => void>,
    setDraft: React.Dispatch<React.SetStateAction<PartialBlock[] | undefined>>
) {
    const locale = en;
    const setIsEditorEmpty = useSetAtom(isEditorEmptyAtom);

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

        if (isEditorEmptyHelper(changedEditor.document)) {
            isRestoring = true;
            setIsEditorEmpty(true);
            saveDraft.cancel();
            setDraft(EDITOR_DEFAULT);
            editor.replaceBlocks(editor.document, EDITOR_DEFAULT);
            return;
        }
        saveDraft(changedEditor.document);
    }

    return ({
        editor,
        handleEditorChange
    });
}