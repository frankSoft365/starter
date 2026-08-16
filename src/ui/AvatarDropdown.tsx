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
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useState } from "react";

export default function AvatarDropdown() {
    const { t } = useTranslation();
    const { handleOverflow } = useOverflowHelper();
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
    const isLoading = useAtomValue(isLoadingAtom);
    // dropdown open state
    const [isOpen, setIsOpen] = useState(false);

    const { userLogout } = useUserLogout();

    function UserAvatar() {
        return <Avatar size="sm" imageUrl={user?.image ?? undefined} username={user?.username || ''} />
    }

    return (
        <details open={isOpen} className="dropdown dropdown-end mr-3">
            <summary className="btn btn-circle" onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
            }}>
                {isLoading
                    ? <button className="btn btn-circle">
                        <span className="loading loading-spinner"></span>
                    </button>
                    : <UserAvatar />}
            </summary>
            {isOpen && <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-64 p-2 shadow-sm">
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
                <li onClick={() => {
                    setIsOpen(false);
                    navigate({ to: meSettingsRoute.to });
                }} className="list-row">
                    <a><GearIcon size={24} />{t('btn.settings')}</a>
                </li>
                <li onClick={() => {
                    userLogout();
                    toast.success(i18n.t('settings.toast.logoutSuccess'));
                    navigate({ to: LoginRoute.to });
                }} className="list-row">
                    <div>
                        <SignOutIcon size={24} />
                        {t('btn.logout')}
                    </div>
                </li>
            </ul>}
        </details>
    );
}