import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

export default function ArticleEditor() {
    const editor = useCreateBlockNote(
        {
            autofocus: true,
            initialContent: [
                {
                    type: 'heading',
                    content: 'Write your heading',
                }
            ]
        },
        []
    );
    return (
        <BlockNoteView editor={editor} />
    );
}