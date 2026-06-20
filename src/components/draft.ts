import { useLocalStorage } from 'react-use';
import { type PartialBlock } from "@blocknote/core";
import { EDITOR_DEFAULT } from '../constants/draft';
import { debounce } from 'es-toolkit/function';
import { isEditorEmptyHelper } from '../utils/isEditorEmptyHelper';
import { useSetAtom } from 'jotai';
import { isEditorEmptyAtom } from '../atoms/editor';

const DRAFT_KEY = 'draft';

export function useDraft() {
    const setIsEditorEmpty = useSetAtom(isEditorEmptyAtom);
    const [draft, setDraft] = useLocalStorage<PartialBlock[]>(DRAFT_KEY, EDITOR_DEFAULT);

    const saveDraft = debounce((document) => {
        if (isEditorEmptyHelper(document)) {
            setIsEditorEmpty(true);
            setDraft(EDITOR_DEFAULT);
            return;
        }
        setIsEditorEmpty(false);
        setDraft(document);
    }, 500);

    return ({
        draft,
        setDraft,
        saveDraft
    })
}