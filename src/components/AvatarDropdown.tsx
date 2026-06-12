import { GearIcon, SignOutIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { Route as meSettingsRoute } from "../routes/me/settings";
import Avatar from "./Avatar";
import useOverflowHelper from "../utils/overflowHelper";
import { userLogout } from "../utils/userLoginHelper";
import { useAtom, useSetAtom } from "jotai";
import { isLoadingAtom, isLoginAtom, userAtom } from "../stores/user";
import { Route as LoginRoute } from "../routes/login";
import { useEffect } from "react";
import { getUserProfile } from "../utils/userProfileHelper";

export default function AvatarDropdown() {
    const { handleOverflow } = useOverflowHelper();
    const navigate = useNavigate();
    const [user, setUser] = useAtom(userAtom);
    const setUserInfo = useSetAtom(userAtom);
    const setIsLogin = useSetAtom(isLoginAtom);
    const setIsLoading = useSetAtom(isLoadingAtom);

    useEffect(() => {
        async function fetchUserInfo() {
            const userInfo = await getUserProfile();
            if (userInfo) {
                setUserInfo(userInfo);
                setIsLogin(true);
            }
        }
        fetchUserInfo();
    }, []);

    function UserAvatar() {
        return <Avatar imageUrl={user?.image ?? undefined} />
    }

    async function doLogout() {
        setIsLoading(true);
        await userLogout();
        setUser(null);
        setIsLogin(false);
        setIsLoading(false);
        navigate({ to: LoginRoute.to });
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