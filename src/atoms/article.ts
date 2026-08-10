import { atom } from 'jotai'

export const isDirtyAtom = atom(false);

// the article id that the user nav to
export const escapeArticleIdAtom = atom<string | null>(null);
