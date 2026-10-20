import { useLocalStorage } from "react-use";
import { type PartialBlock } from "@blocknote/core";
import { debounce } from "es-toolkit/function";
import { isEditorEmpty } from "../../utils/editorHelper";
import { useSetAtom } from "jotai";
import { isEditorEmptyAtom } from "../../atoms/editor";

export function useDraft(
  draftKey: string,
  editorDefaultContent: PartialBlock[],
) {
  const setIsEditorEmpty = useSetAtom(isEditorEmptyAtom);
  const [draft, setDraft] = useLocalStorage<PartialBlock[]>(
    draftKey,
    editorDefaultContent,
  );

  const saveDraft = debounce((document) => {
    if (isEditorEmpty(document)) {
      setIsEditorEmpty(true);
      setDraft(editorDefaultContent);
      return;
    }
    setIsEditorEmpty(false);
    setDraft(document);
  }, 500);

  return {
    draft,
    setDraft,
    saveDraft,
  };
}
