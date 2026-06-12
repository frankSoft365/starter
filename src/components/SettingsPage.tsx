import Avatar from "./Avatar";
import { toast } from "sonner";
import { useUserProfile } from "./userProfile";
import { useRef } from "react";

export default function SettingsPage() {
    const {
        username,
        setUsername,
        image,
        setImage,
        isModalOpen,
        setIsModalOpen,
        user,
        isUserProfileLoading,
        isLoadingError,
        isUpdating,
        handleUpdate
    } = useUserProfile();

    if (isLoadingError) {
        toast.error('Failed to retrieve user information');
    }

    function handleImageChange(evnet: React.ChangeEvent<HTMLInputElement>) {
        const file = evnet.target.files![0];
        const url = URL.createObjectURL(file);
        setImage(url);
    }

    const imageUploadRef = useRef<HTMLInputElement>(null);

    return (
        <div className="p-3 relative w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Settings</h1>
            {/* user information show */}
            {isUserProfileLoading && <div className="skeleton rounded-box h-48 w-full"></div>}
            {!isUserProfileLoading &&
                <div>
                    <ul className="list bg-base-100 rounded-box shadow-md w-full">
                        <li className="list-row">
                            <div className="text-left">Email address</div>
                            <div className="text-right">
                                {user?.email}
                            </div>
                        </li>
                        <li className="list-row">
                            <div className="text-left">Username</div>
                            <div className="text-right">
                                {user?.username}
                            </div>
                        </li>
                        <li className="list-row">
                            <div className="text-left">Photo</div>
                            <div className="text-right">
                                <Avatar imageUrl={user?.image ?? undefined} username={user?.username || ''} />
                            </div>
                        </li>
                    </ul>
                    {/* update button */}
                    <button
                        onClick={() => {
                            setUsername(user?.username || '');
                            setImage(user?.image || undefined);
                            setIsModalOpen(true);
                        }}
                        className="btn btn-primary absolute right-4 mt-4"
                    >
                        Update
                    </button>
                </div>
            }
            {/* modal */}
            {isModalOpen && (
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
                                        <button type="button" disabled={isUpdating} onClick={() => setImage(undefined)} className="btn btn-ghost btn-xs btn-error">Remove</button>
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
                                    onChange={(e) => setUsername(e.target.value)}
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
            )}
        </div>
    );
}