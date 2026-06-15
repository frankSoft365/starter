import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { UserVO } from "../types/UserVO";
import Avatar from "./Avatar";
import { useUserUpdate } from "./userProfile";

export default function SettingsPageUpdateModal({ user, setIsModalOpen }: { user: UserVO, setIsModalOpen: Dispatch<SetStateAction<boolean>> }) {
    const [currentAvatarFile, setCurrentAvatarFile] = useState<File | null>(null);
    const [isRemoveAvatar, setIsRemoveAvatar] = useState(false);

    const {
        username,
        setUsername,
        image,
        setImage,
        isUpdating,
        handleUpdate
    } = useUserUpdate(user, setIsModalOpen, currentAvatarFile, isRemoveAvatar);

    function handleImageChange(evnet: React.ChangeEvent<HTMLInputElement>) {
        const file = evnet.target.files![0];
        const url = URL.createObjectURL(file);
        setImage(url);
        setCurrentAvatarFile(file);
    }

    const imageUploadRef = useRef<HTMLInputElement>(null);

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Profile information</h3>
                <form
                    action={() => handleUpdate()}
                    className="fieldset bg-base-200 border-base-300 w-xs md:w-full p-4">
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

                    <fieldset className="fieldset">
                        <label className="label">Username</label>
                        <input
                            disabled={isUpdating}
                            value={username}
                            onChange={(e) => setUsername(e.target.value.trim())}
                            type="text"
                            className="input validator"
                            placeholder="Username"
                            required
                            pattern="^[A-Za-z][A-Za-z0-9_\-]*$"
                            minLength={6}
                            maxLength={20}
                            title="Only letters, numbers, underscores, or dash"
                        />
                        <p className="validator-hint">
                            Must be 6 to 20 characters
                            <br />containing only letters, numbers or dash
                        </p>
                    </fieldset>

                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={() => {
                                setUsername('');
                                setImage('');
                                setIsModalOpen(false);
                            }}
                            className="btn">Close</button>
                        <button
                            type="submit"
                            disabled={(username.trim() === (user?.username || '')) &&
                                (image === (user?.image || undefined)) || isUpdating}
                            className="btn btn-success"

                        >
                            {isUpdating && <span className="loading loading-spinner"></span>}
                            {!isUpdating && 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}