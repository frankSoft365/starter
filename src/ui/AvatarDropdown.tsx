import { GearIcon, SignOutIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { Route as meSettingsRoute } from "../routes/_app/_protected/me/settings";
import Avatar from "../ui/Avatar";
import useOverflowHelper from "../utils/overflowHelper";
import { useAtomValue } from "jotai";
import { isLoadingAtom, userAtom } from "../atoms/user";
import { Route as LoginRoute } from "../routes/login";
import { toast } from "sonner";
import { useUserLogout } from "@/features/auth/userLogin";

export default function AvatarDropdown() {
    const { handleOverflow } = useOverflowHelper();
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
    const isLoading = useAtomValue(isLoadingAtom);

    const { userLogout } = useUserLogout();

    function UserAvatar() {
        return <Avatar imageUrl={user?.image ?? undefined} username={user?.username || ''} />
    }

    return (
        <div className="dropdown dropdown-bottom dropdown-end dropdown-hover mr-3">

            <div tabIndex={0} role="button" className="btn btn-circle">
                {isLoading
                    ? <button className="btn btn-circle">
                        <span className="loading loading-spinner"></span>
                    </button>
                    : <UserAvatar />}
            </div>
            <ul
                tabIndex={-1}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-68 p-2 shadow-sm mt-1">
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
                <li onClick={() => navigate({ to: meSettingsRoute.to })} className="list-row"><a><GearIcon size={24} />Settings</a></li>
                <li onClick={() => {
                    userLogout();
                    toast.success('Logout successful');
                    navigate({ to: LoginRoute.to });
                }} className="list-row">
                    <div>
                        <SignOutIcon size={24} />
                        Logout
                    </div>
                </li>
            </ul>
        </div>
    );
}