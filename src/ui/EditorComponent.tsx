import type { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { themeAtom } from "@/atoms/theme";
import { useAtomValue } from "jotai";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

export default function EditorComponent({
  editor,
  onChange,
  editable = true,
}: {
  editor: BlockNoteEditor;
  onChange?: (changedEditor: BlockNoteEditor) => void;
  editable?: boolean;
}) {
  const theme = useAtomValue(themeAtom);
  return (
    <div className={editable ? "article-editor" : "article-readonly"}>
      <BlockNoteView
        editor={editor}
        slashMenu={false}
        onChange={onChange}
        editable={editable}
        theme={theme === "dracula" ? "dark" : "light"}
      />
    </div>
  );
}
