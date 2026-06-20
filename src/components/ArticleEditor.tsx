import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { useEditor } from "./editor";
import { useDraft } from "./draft";

export default function ArticleEditor() {
    const { draft, setDraft, saveDraft } = useDraft();
    const { editor, handleEditorChange } = useEditor(draft, saveDraft, setDraft);

    return (
        <BlockNoteView
            editor={editor}
            onChange={handleEditorChange}
        />
    );
}