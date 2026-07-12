import { HouseIcon, NotePencilIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import SignedIn from "./SignedIn";
import { Route as editorRoute } from "../routes/_app/_protected/editor";
import { Route as homeRoute } from "../routes/_app/index";
import { Route as profileRoute } from "../routes/_app/_protected/$emailname";
import { useAtomValue } from "jotai";
import { userAtom } from "../atoms/user";
import useProfilePathHelper from "../utils/profilePathHelper";

export default function DrawerSide() {
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
    const { handleProfilePath } = useProfilePathHelper();
    return (
        <div className="z-1000 drawer-side is-drawer-close:overflow-visible">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
                {/* Sidebar content here */}
                <ul className="menu w-full grow">
                    {/* login then user can write */}
                    <SignedIn>
                        {/* List item : write button */}
                        <li>
                            <button onClick={() => navigate({ to: editorRoute.to })} className="write-btn-sidebar-bg is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Write">
                                {/* Write icon */}
                                <NotePencilIcon size={24} />
                                <span className="is-drawer-close:hidden">Write</span>
                            </button>
                        </li>
                    </SignedIn>
                    {/* List item : home page */}
                    <li>
                        <button onClick={() => navigate({ to: homeRoute.to })} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Home">
                            {/* Home icon */}
                            <HouseIcon size={24} />
                            <span className="is-drawer-close:hidden">Home</span>
                        </button>
                    </li>
                    {/* List item : user profile */}
                    <li>
                        <button onClick={() => navigate({ to: profileRoute.to, params: { emailname: handleProfilePath(user?.email) } })} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Profile">
                            {/* Profile icon */}
                            <UserCircleIcon size={24} />
                            <span className="is-drawer-close:hidden">Profile</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}