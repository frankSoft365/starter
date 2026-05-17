import { useSetAtom } from "jotai";
import type { User } from "../types/User";
import { doLogoutAtom } from "../stores/user";
import useOverflowHelper from "../utils/OverflowHelper";
import { GearIcon, SignOutIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { Route as meSettingsRoute } from "../routes/me/settings";
import Avatar from "./Avatar";


export default function AvatarDropdown({ user }: { user: User | null }) {
    const doLogout = useSetAtom(doLogoutAtom);
    const { handleOverflow } = useOverflowHelper();
    const navigate = useNavigate();

    function UserAvatar() {
        return <Avatar imageUrl={user?.image ?? undefined} />
    }

    return (
        <div className="dropdown dropdown-bottom dropdown-end dropdown-hover mr-3">
            <button className="btn btn-circle">
                <UserAvatar />
            </button>
            <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-68 p-2 shadow-sm">
                <li className="list-row">
                    <a>
                        <UserAvatar />
                        <div>
                            <div>{user?.username}</div>
                            <div className="tooltip" data-tip={user?.email}>
                                <div className="text-xs ">{handleOverflow(user?.email, 25)}</div>
                            </div>
                        </div>
                    </a>
                </li>
                <li className="list-row"><a onClick={() => navigate({ to: meSettingsRoute.to })}><GearIcon size={24} />Settings</a></li>
                <li className="list-row"><a onClick={doLogout}><SignOutIcon size={24} />Logout</a></li>
            </ul>
        </div>
    );
}