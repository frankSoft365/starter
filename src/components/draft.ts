import { useLocalStorage } from 'react-use';
import { type PartialBlock } from "@blocknote/core";
import { EDITOR_DEFAULT } from '../constants/draft';

const DRAFT_KEY = 'draft';

export function useDraft() {
    const [draft, setDraft] = useLocalStorage<PartialBlock[]>(DRAFT_KEY, EDITOR_DEFAULT);
    return ({
        draft,
        setDraft
    })
}