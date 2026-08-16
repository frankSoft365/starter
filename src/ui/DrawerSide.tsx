import { HouseIcon, NotePencilIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import SignedIn from "./SignedIn";
import { Route as editorRoute } from "../routes/_app/_protected/editor";
import { Route as homeRoute } from "../routes/_app/index";
import { Route as profileRoute } from "../routes/_app/_protected/_profile/profile";
import { useTranslation } from "react-i18next";
import { Route } from "@/routes/_app/_protected/_profile/profile/index";

export default function DrawerSide({ onNav }: { onNav: (value: boolean) => void }) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const isHomeRoute = location.pathname === homeRoute.to;
    const isEditorRoute = location.pathname === editorRoute.to;
    const isProfileRoute = location.pathname.includes(Route.to);

    return (
        <div className="drawer-side">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
            {/* Sidebar content here */}
            <div className="flex min-h-full flex-col items-start bg-base-100 border-r-2 border-base-200 w-64 md:is-drawer-close:w-64 md:is-drawer-open:w-0">
                <ul className="menu w-full md:is-drawer-open:hidden">
                    {/* login then user can write */}
                    <SignedIn>
                        {/* List item : write button */}
                        <li>
                            <button className={isEditorRoute ? "border-l-2 border-base-800" : 'opacity-70 border-l-2 border-white'} onClick={() => {
                                navigate({ to: editorRoute.to });
                                onNav(false);
                            }}>
                                {/* Write icon */}
                                <NotePencilIcon size={24} weight={isEditorRoute ? "fill" : undefined} />
                                <span>{t('btn.write')}</span>
                            </button>
                        </li>
                    </SignedIn>
                    {/* List item : home page */}
                    <li>
                        <button className={isHomeRoute ? "border-l-2 border-base-800" : 'opacity-70 border-l-2 border-white'} onClick={() => {
                            navigate({ to: homeRoute.to });
                            onNav(false);
                        }}>
                            {/* Home icon */}
                            <HouseIcon size={24} weight={isHomeRoute ? "fill" : undefined} />
                            <span>{t('btn.home')}</span>
                        </button>
                    </li>
                    {/* List item : user profile */}
                    <li>
                        <button className={isProfileRoute ? "border-l-2 border-base-800" : 'opacity-70 border-l-2 border-white'} onClick={() => {
                            navigate({ to: profileRoute.to });
                            onNav(false);
                        }}>
                            {/* Profile icon */}
                            <UserCircleIcon size={24} weight={isProfileRoute ? "fill" : undefined} />
                            <span>{t('btn.profile')}</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}