import { HouseIcon, NotePencilIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import SignedIn from "./SignedIn";
import { Route as editorRoute } from "../routes/_app/_protected/editor";
import { Route as homeRoute } from "../routes/_app/index";
import { Route as profileRoute } from "../routes/_app/_protected/_profile/@";
import { useTranslation } from "react-i18next";

export default function DrawerSide() {
    const { t } = useTranslation();
    const navigate = useNavigate();
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
                            <button onClick={() => navigate({ to: editorRoute.to })} className="write-btn-sidebar-bg is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip={t('btn.write')}>
                                {/* Write icon */}
                                <NotePencilIcon size={24} />
                                <span className="is-drawer-close:hidden">{t('btn.write')}</span>
                            </button>
                        </li>
                    </SignedIn>
                    {/* List item : home page */}
                    <li>
                        <button onClick={() => navigate({ to: homeRoute.to })} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip={t('btn.home')}>
                            {/* Home icon */}
                            <HouseIcon size={24} />
                            <span className="is-drawer-close:hidden">{t('btn.home')}</span>
                        </button>
                    </li>
                    {/* List item : user profile */}
                    <li>
                        <button onClick={() => navigate({ to: profileRoute.to })} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip={t('btn.profile')}>
                            {/* Profile icon */}
                            <UserCircleIcon size={24} />
                            <span className="is-drawer-close:hidden">{t('btn.profile')}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}