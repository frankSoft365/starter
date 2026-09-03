import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import FieldInfo from "@/ui/FieldInfo";
import {
  CreateCollectionListSchema,
  type CreateCollectionListForm,
} from "@/schemas/collection";
import { useCreateCollectionList } from "@/features/collection/collection";

export default function CreateListModal({
  articleId,
  onClose,
}: {
  articleId?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { mutate, isPending } = useCreateCollectionList(articleId);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      isPublic: 0,
    } satisfies CreateCollectionListForm,
    validators: {
      onChange: CreateCollectionListSchema,
      onSubmit: CreateCollectionListSchema,
    },
    onSubmit: ({ value }) => {
      mutate(value, {
        onSuccess: () => {
          toast.success(t("profile.list.createdTip"));
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || t("common.operationFailed"));
        },
      });
    },
  });

  return (
    <div
      className="modal modal-open pointer-events-auto"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="modal-box w-11/12 md:max-w-4xl md:aspect-5/3 flex flex-col items-center justify-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h1 className="text-center font-bold text-xl md:text-4xl">
          {t("profile.list.createTitle")}
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-3 w-full max-w-sm mt-8"
        >
          <form.Field name="name">
            {(field) => (
              <div className="text-left">
                <input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="text"
                  className="input input-bordered w-full"
                  placeholder={t("profile.list.namePlaceholder")}
                  maxLength={60}
                  disabled={isPending}
                />
                <div className="flex items-center justify-between mt-1">
                  <FieldInfo field={field} />
                  <span className="text-xs opacity-50 ml-auto">
                    {field.state.value.length}/60
                  </span>
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="text-left">
                <textarea
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="textarea textarea-bordered w-full resize-none"
                  placeholder={t("profile.list.descriptionPlaceholder")}
                  rows={4}
                  maxLength={280}
                  disabled={isPending}
                />
                <div className="flex items-center justify-between mt-1">
                  <FieldInfo field={field} />
                  <span className="text-xs opacity-50 ml-auto">
                    {field.state.value.length}/280
                  </span>
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="isPublic">
            {(field) => (
              <label className="flex items-center gap-2 cursor-pointer select-none py-1 text-left">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={field.state.value === 0}
                  onChange={(e) => field.handleChange(e.target.checked ? 0 : 1)}
                  disabled={isPending}
                />
                <span className="text-sm">{t("profile.list.makePrivate")}</span>
              </label>
            )}
          </form.Field>

          <div className="modal-action justify-center items-center gap-2 md:gap-4 mt-2">
            <button
              type="button"
              className="btn btn-outline btn-sm md:btn-md rounded-full"
              onClick={onClose}
              disabled={isPending}
            >
              {t("btn.cancel")}
            </button>
            <button
              type="submit"
              className="btn btn-success btn-sm md:btn-md rounded-full"
              disabled={isPending}
            >
              {isPending && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              {t("profile.list.createAction")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
