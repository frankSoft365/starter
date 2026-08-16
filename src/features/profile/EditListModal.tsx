import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import FieldInfo from "@/ui/FieldInfo";
import { CreateCollectionListSchema, type CreateCollectionListForm } from "@/schemas/collection";
import type { CollectionListDetailVO } from "@/types/collection";
import { useUpdateCollectionList } from "./collection";

export default function EditListModal({
    list,
    onClose,
}: {
    list: CollectionListDetailVO;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const { mutate, isPending } = useUpdateCollectionList(list.id);

    const defaultValues = useMemo<CreateCollectionListForm>(() => ({
        name: list.name,
        description: list.description ?? '',
        isPublic: list.isPublic,
    }), [list.id]);

    const form = useForm({
        defaultValues,
        validators: {
            onChange: CreateCollectionListSchema,
            onSubmit: CreateCollectionListSchema,
        },
        onSubmit: ({ value }) => {
            const patch: { listId: string; name?: string; description?: string; isPublic?: number } = { listId: list.id };
            if (value.name !== defaultValues.name) patch.name = value.name;
            if (value.description !== defaultValues.description) patch.description = value.description;
            if (value.isPublic !== defaultValues.isPublic) patch.isPublic = value.isPublic;
            mutate(patch, {
                onSuccess: () => {
                    toast.success(t('profile.list.updatedTip'));
                    onClose();
                },
                onError: (err) => {
                    toast.error(err.message || t('common.operationFailed'));
                },
            });
        },
    });

    const values = useStore(form.store, (state) => state.values);
    const hasChanges =
        values.name !== defaultValues.name ||
        values.description !== defaultValues.description ||
        values.isPublic !== defaultValues.isPublic;

    return (
        <div
            className="modal modal-open pointer-events-auto"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div className="modal-box w-11/12 md:max-w-4xl md:aspect-5/3 flex flex-col items-center justify-center text-center" onClick={(e) => e.stopPropagation()}>
                <button
                    type="button"
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={onClose}
                >✕</button>
                <h1 className=" font-bold text-xl md:text-3xl">{t('profile.list.editTitle')}</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="flex flex-col gap-3 w-full max-w-sm mt-4"
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
                                    placeholder={t('profile.list.namePlaceholder')}
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
                                    placeholder={t('profile.list.descriptionPlaceholder')}
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
                                <span className="text-sm">{t('profile.list.makePrivate')}</span>
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
                            {t('btn.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success btn-sm md:btn-md rounded-full"
                            disabled={isPending || !hasChanges}
                        >
                            {isPending && <span className="loading loading-spinner loading-sm"></span>}
                            {t('btn.done')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
