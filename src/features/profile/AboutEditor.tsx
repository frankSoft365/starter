import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  type DefaultReactSuggestionItem,
} from "@blocknote/react";
import { type BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { filterSuggestionItems } from "@blocknote/core/extensions";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useAtomValue } from "jotai";
import { themeAtom } from "@/atoms/theme";

const CustomMenuItems = ["Paragraph", "Image"];

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (
  editor: BlockNoteEditor,
): DefaultReactSuggestionItem[] => {
  return getDefaultReactSlashMenuItems(editor).filter((item) => {
    return CustomMenuItems.includes(item.title);
  });
};

export default function AboutEditor({
  editor,
  editable = true,
}: {
  editor: BlockNoteEditor;
  editable?: boolean;
}) {
  const theme = useAtomValue(themeAtom);
  return (
    <div>
      <div className="mb-2">
        <div className={editable ? "article-editor" : "article-readonly"}>
          <BlockNoteView
            editor={editor}
            slashMenu={false}
            editable={editable}
            theme={theme === "dracula" ? "dark" : "light"}
          >
            <SuggestionMenuController
              triggerCharacter={"/"}
              getItems={async (query) =>
                filterSuggestionItems(getCustomSlashMenuItems(editor), query)
              }
            />
          </BlockNoteView>
        </div>
      </div>
    </div>
  );
}
