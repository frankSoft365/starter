import type { UserVO } from "@/types/user";
import { type Dispatch, type SetStateAction } from "react";
import { useChangeAvatar } from "./userAvatar";
import { useUserUpdate } from "./userProfile";
import Avatar from "@/ui/Avatar";
import { useForm, useStore } from "@tanstack/react-form";
import FieldInfo from "@/ui/FieldInfo";
import * as z from "zod";

const USERNAME_REGEX = /^[a-zA-Z0-9_\-]+$/;

const UsernameSchema = z.string()
    .trim()
    .min(1, "Username is required")
    .min(6, "Username must be between 6 and 20 characters.")
    .max(20, "Username must be between 6 and 20 characters.")
    .regex(USERNAME_REGEX, "Username does not match required format");

const FormSchema = z.object({
    username: UsernameSchema
})

type FormSchema = z.infer<typeof FormSchema>;

export default function SettingsPageUpdateModal({ user, setIsModalOpen }: { user: UserVO, setIsModalOpen: Dispatch<SetStateAction<boolean>> }) {
    const { imageUploadRef, image, setImage, handleImageChange, currentAvatarFile } = useChangeAvatar(user);

    const {
        isUpdating,
        handleUpdate,
        setIsRemoveAvatar,
        isUploading
    } = useUserUpdate(user, setIsModalOpen, currentAvatarFile);

    const defaultValues: FormSchema = { username: user.username }

    const form = useForm({
        defaultValues: defaultValues,
        onSubmit: ({ value }) => {
            handleUpdate(value);
        },
        validators: {
            onChange: FormSchema,
            onSubmit: FormSchema
        },
    });

    const username = useStore(form.store, (state) => state.values.username)

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Profile information</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                    className="fieldset bg-base-200 border-base-300 w-xs md:w-full p-4"
                >
                    <label className="label">Photo</label>
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
                                    Update
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
                                    Remove
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
                            <div className="text-xs">Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.</div>
                        </div>
                    </div>

                    <form.Field
                        name="username"
                        children={(field) => (
                            <>
                                <fieldset className="fieldset">
                                    <label className="label">Username</label>
                                    <input
                                        disabled={isUpdating}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        type="text"
                                        className="input"
                                        placeholder="Username"
                                        title="Only letters, numbers, underscores, or dash"
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
                            className="btn">Close</button>
                        <button
                            type="submit"
                            disabled={((username.trim() === user.username) &&
                                (image === (user.image || undefined))) || isUpdating || isUploading}
                            className="btn btn-success"
                        >
                            {(isUpdating || isUploading) && <span className="loading loading-spinner"></span>}
                            {(!isUpdating && !isUploading) && 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}