import type { BlockNoteEditor } from "@blocknote/core";
import AboutEditor from "./AboutEditor";
import { ABOUT_EDITOR_INIT } from "@/constants/draft";
import { buildArticleOriginal, isEditorEmpty } from "@/utils/editorHelper";
import { useUserUpdateAbout } from "./profile";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { userAtom } from "@/atoms/user";

export default function AboutEditorArea({
  userId,
  editor,
  showEditor,
  setShowEditor,
  setIsFromGetStarted,
  originalAbout,
}: {
  userId: string;
  editor: BlockNoteEditor;
  showEditor: boolean;
  setShowEditor: (value: boolean) => void;
  setIsFromGetStarted: (value: boolean) => void;
  originalAbout: string;
}) {
  const currentUser = useAtomValue(userAtom);
  const { t } = useTranslation();
  const isMyProfile = (currentUser && currentUser.id === userId) ?? false;
  const { handleUpdateAbout, isSaving } = useUserUpdateAbout(userId);
  function leaveEditorArea() {
    setShowEditor(false);
  }
  function handleClickEdit() {
    setShowEditor(true);
  }
  // editor area - cancel button
  function handleClickCancel(originalAbout: string) {
    // 如果不是 "" 需要恢复先前的内容
    if (originalAbout) {
      const about = JSON.parse(originalAbout);
      editor.replaceBlocks(editor.document, about);
    } else {
      // 如果是 ""
      editor.replaceBlocks(editor.document, ABOUT_EDITOR_INIT);
    }
    setIsFromGetStarted(false);
    leaveEditorArea();
  }
  // editor area - save button
  function handleClickSave() {
    // 空白一律视为 ""
    if (isEditorEmpty(editor.document)) {
      handleUpdateAbout(
        {
          about: "",
        },
        {
          onSuccess: () => {
            // 仅在输入空白时需要恢复编辑器初始化
            editor.replaceBlocks(editor.document, ABOUT_EDITOR_INIT);
            // 如果是从 getStarted 而来
            setIsFromGetStarted(false);
            leaveEditorArea();
          },
        },
      );
      return;
    }
    const aboutJson = buildArticleOriginal(editor);
    handleUpdateAbout(
      { about: aboutJson },
      {
        onSuccess: () => {
          // 如果是从 getStarted 而来
          setIsFromGetStarted(false);
          leaveEditorArea();
        },
      },
    );
  }

  return (
    <div className="mt-4">
      <AboutEditor editor={editor} editable={showEditor} />
      {isMyProfile && !showEditor && (
        <div className="flex items-center justify-end">
          <button
            onClick={handleClickEdit}
            className="btn btn-outline rounded-full"
          >
            {t("btn.edit")}
          </button>
        </div>
      )}
      {showEditor && (
        <div className="flex items-center justify-end">
          <div>
            <button
              onClick={() => handleClickCancel(originalAbout)}
              className="btn btn-outline rounded-full"
            >
              {t("btn.cancel")}
            </button>
            <button
              disabled={isSaving}
              onClick={handleClickSave}
              className="btn ml-2 btn-neutral rounded-full"
            >
              {t("btn.save")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
