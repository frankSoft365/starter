import { atom } from 'jotai'
import type { ArticlePublishPreview } from '../types/article';

export const isEditorEmptyAtom = atom(true);

export const editorEmptySignalAtom = atom(0);

export const editorSubmissionSignalAtom = atom(0);

export const editorPublishSignalAtom = atom(0);

export const articlePreviewAtom = atom<null | ArticlePublishPreview>(null);