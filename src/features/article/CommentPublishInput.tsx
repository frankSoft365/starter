import { CreateCommentSchema, type CreateCommentForm } from "@/schemas/comment";
import Avatar from "@/ui/Avatar";
import { useForm, useStore } from "@tanstack/react-form";
import { useTranslation } from "react-i18next";
import { useAddComment } from "../comment/comment";
import FieldInfo from "@/ui/FieldInfo";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import type { ArticleVO } from "@/types/article";
import type { RefObject } from "react";

export default function CommentPublishInput({
  articleId,
  article,
  commentRef,
}: {
  articleId: string;
  article: ArticleVO;
  commentRef: RefObject<HTMLDivElement | null>;
}) {
  const { t } = useTranslation();
  const user = useAtomValue(userAtom);
  const { handleAddComment, isAddingComment } = useAddComment(articleId);
  // write your comment form
  const defaultValues: CreateCommentForm = {
    commentContent: "",
  };
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      handleAddComment(
        { params: { content: value.commentContent } },
        {
          onSuccess: () => {
            form.resetField("commentContent");
          },
        },
      );
    },
    validators: {
      onChange: CreateCommentSchema,
      onSubmit: CreateCommentSchema,
    },
  });
  const canSubmit = useStore(form.store, (state) => state.canSubmit);
  return (
    <div
      ref={commentRef}
      className="flex flex-col items-start p-4 w-full lg:w-4xl mx-auto"
    >
      <h2 className="text-lg md:text-2xl font-bold">
        {t("comment.response", { count: article.responseNum })}
      </h2>
      <div className="flex flex-row items-center text-sm gap-1 my-3">
        <Avatar
          imageUrl={user?.image ?? undefined}
          username={user?.username || ""}
          size="sm"
        />
        <span className="ml-1.5">{user?.username}</span>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="w-full"
      >
        <form.Field
          name="commentContent"
          children={(field) => (
            <>
              <textarea
                placeholder={t("comment.commentInput.placeholder")}
                className="textarea w-full textarea-md lg:textarea-lg xl:textarea-xl"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />
        <div className="w-full flex">
          <button
            disabled={!canSubmit || isAddingComment}
            type="submit"
            className="btn btn-sm md:btn-base btn-neutral rounded-full my-3 ml-auto"
          >
            {isAddingComment ? (
              <span className="loading loading-spinner"></span>
            ) : (
              t("btn.publish")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
