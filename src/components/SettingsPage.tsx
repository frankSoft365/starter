import Avatar from "./Avatar";
import { toast } from "sonner";
import { useUserProfile } from "./userProfile";
import { useState } from "react";
import SettingsPageUpdateModal from "./SettingsPageUpdateModal";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { Route as mePasswordRoute } from "../routes/_app/_protected/me/password";

export default function SettingsPage() {
    const {
        user,
        isUserProfileLoading,
        isLoadingError,
    } = useUserProfile();

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoadingError) {
        toast.error('Failed to retrieve user information');
    }

    return (
        <div className="p-3 relative w-full md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold m-4">Settings</h1>
            <p className="text-xl md:text-xl font-medium m-4">Profile</p>
            {/* user information show */}
            {(isUserProfileLoading || isLoadingError) && <div className="skeleton rounded-box h-64 m-4"></div>}
            {!isUserProfileLoading &&
                <div className="m-4">
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
                        <li className="list-row">
                            {/* update button */}
                            <div className="text-left"></div>
                            <div className="text-right">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="btn btn-primary"
                                >
                                    Update
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            }
            <p className="text-xl md:text-xl font-medium m-4">Account</p>
            <div className="m-4">
                <ul className="list bg-base-100 rounded-box shadow-md w-full">
                    <li className="list-row hover:bg-gray-50 cursor-pointer relative" onClick={() => navigate({ to: mePasswordRoute.to })}>
                        <div className="text-left cursor-pointer">Change Password</div>
                        <div className="text-right cursor-pointer w-12 absolute right-0">
                            <ArrowUpRightIcon size={24} />
                        </div>
                    </li>
                </ul>
            </div>
            {/* modal */}
            {(isModalOpen && user) && (
                <SettingsPageUpdateModal user={user} setIsModalOpen={setIsModalOpen} />
            )}
        </div>
    );
}