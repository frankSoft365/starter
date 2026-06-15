import Avatar from "./Avatar";
import { toast } from "sonner";
import { useUserProfile } from "./userProfile";
import { useState } from "react";
import SettingsPageUpdateModal from "./SettingsPageUpdateModal";

export default function SettingsPage() {
    const {
        user,
        isUserProfileLoading,
        isLoadingError,
    } = useUserProfile();

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoadingError) {
        toast.error('Failed to retrieve user information');
    }

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
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary absolute right-4 mt-4"
                    >
                        Update
                    </button>
                </div>
            }
            {/* modal */}
            {(isModalOpen && user) && (
                <SettingsPageUpdateModal user={user} setIsModalOpen={setIsModalOpen} />
            )}
        </div>
    );
}