import type { UserVO } from "@/types/user";
import { type Dispatch, type SetStateAction } from "react";
import { useChangeAvatar } from "./userAvatar";
import { useUserUpdate } from "./userProfile";
import Avatar from "@/ui/Avatar";
import { useForm, useStore } from "@tanstack/react-form";
import FieldInfo from "@/ui/FieldInfo";
import { AccountUpdateSchema, type AccountUpdateForm } from "@/schemas/account";
import { useTranslation } from "react-i18next";

export default function SettingsPageUpdateModal({
  user,
  setIsModalOpen,
}: {
  user: UserVO;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { t } = useTranslation();
  const {
    imageUploadRef,
    image,
    setImage,
    handleImageChange,
    currentAvatarFile,
  } = useChangeAvatar(user);

  const { isUpdating, handleUpdate, setIsRemoveAvatar, isUploading } =
    useUserUpdate(user, setIsModalOpen, currentAvatarFile);

  const defaultValues: AccountUpdateForm = { username: user.username };

  const form = useForm({
    defaultValues: defaultValues,
    onSubmit: ({ value }) => {
      handleUpdate(value);
    },
    validators: {
      onChange: AccountUpdateSchema,
      onSubmit: AccountUpdateSchema,
    },
  });

  const username = useStore(form.store, (state) => state.values.username);

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-xl md:text-lg mb-4">
          {t("settings.modal.profileInfo")}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="fieldset w-full py-4"
        >
          <label className="label">{t("settings.page.photo")}</label>
          <div className="flex flex-row gap-4">
            {/* click the avatar and open your file management */}
            <label htmlFor="avatar">
              <Avatar imageUrl={image} hover={true} username={username} />
            </label>
            <div className="flex flex-col gap-4">
              <div>
                {/* click the avatar and open your file management */}
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => {
                    if (imageUploadRef.current) {
                      imageUploadRef.current.click();
                    }
                  }}
                  className="btn btn-ghost btn-xs btn-success mr-2"
                >
                  {t("settings.modal.update")}
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => {
                    setImage(undefined);
                    setIsRemoveAvatar(true);
                  }}
                  className="btn btn-ghost btn-xs btn-error"
                >
                  {t("settings.modal.remove")}
                </button>
                {/* upload your file */}
                <input
                  ref={imageUploadRef}
                  className="hidden"
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <div className="text-xs">{t("settings.modal.uploadHint")}</div>
            </div>
          </div>

          <form.Field
            name="username"
            children={(field) => (
              <>
                <fieldset className="fieldset">
                  <label className="label">{t("settings.page.username")}</label>
                  <input
                    disabled={isUpdating}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    className="input"
                    placeholder={t("settings.page.username")}
                  />
                </fieldset>
                <FieldInfo field={field} />
              </>
            )}
          />

          <div className="modal-action">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="btn rounded-full mr-1"
            >
              {t("settings.modal.close")}
            </button>
            <button
              type="submit"
              disabled={
                (username.trim() === user.username &&
                  image === (user.image || undefined)) ||
                isUpdating ||
                isUploading
              }
              className="btn btn-success rounded-full"
            >
              {(isUpdating || isUploading) && (
                <span className="loading loading-spinner"></span>
              )}
              {!isUpdating && !isUploading && t("btn.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
