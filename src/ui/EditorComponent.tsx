import type { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

export default function EditorComponent({
    editor,
    onChange,
    editable
}: {
    editor: BlockNoteEditor,
    onChange?: (changedEditor: BlockNoteEditor) => void,
    editable?: boolean
}
) {
    return (
        <BlockNoteView
            editor={editor}
            onChange={onChange}
            editable={editable}
        />
    );
}