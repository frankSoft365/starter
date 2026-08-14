import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import Avatar from "@/ui/Avatar";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { Route as homeRoute } from "@/routes/_app/_protected/_profile/@/index";
import { Route as repostsRoute } from "@/routes/_app/_protected/_profile/@/reposts";
import { Route as activityRoute } from "@/routes/_app/_protected/_profile/@/activity";
import { Route as listsRoute } from "@/routes/_app/_protected/_profile/@/lists";
import { Route as aboutRoute } from "@/routes/_app/_protected/_profile/@/about";
import { useTranslation } from "react-i18next";

export default function ProfileTab({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const user = useAtomValue(userAtom);
    const location = useLocation();
    const navigate = useNavigate();

    const profileTabMap = [
        { name: t('profile.tab.home'), path: homeRoute.to },
        { name: t('profile.tab.reposts'), path: repostsRoute.to },
        { name: t('profile.tab.activity'), path: activityRoute.to },
        { name: t('profile.tab.lists'), path: listsRoute.to },
        { name: t('profile.tab.about'), path: aboutRoute.to },
    ]

    return (
        <div className="w-full flex">
            <div className="w-full md:w-3xl shadow-xl">
                <div className="flex w-full justify-between">
                    <div className="flex p-5 gap-3">
                        <div className="inline-flex md:hidden">
                            <Avatar imageUrl={user?.image ?? ''} username={user?.username ?? ''} />
                        </div>
                        <div>
                            <div className="w-full text-lg md:text-3xl font-bold">{user?.username || t('profile.unknownUsername')}</div>
                        </div>
                    </div>
                    <div className="flex items-center p-4">
                        <button className="btn btn-square btn-ghost" popoverTarget="popover-profile-more" style={{ anchorName: "--anchor-1" }} >
                            <DotsThreeIcon size={24} color="#676565" weight="bold" />
                        </button>
                        <ul className="dropdown dropdown-end menu w-42 bg-base-100 shadow-lg"
                            popover="auto" id="popover-profile-more" style={{ positionAnchor: "--anchor-1" }}>
                            <li>
                                <button className="btn btn-ghost justify-start text-xs font-light">
                                    {t('profile.menu.copyLink')}
                                </button>
                            </li>
                            <li>
                                <button className="btn btn-ghost justify-start text-xs font-light">
                                    {t('profile.menu.designProfile')}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <ul className="menu bg-base-100 menu-horizontal shadow-xs">
                    {profileTabMap.map((item, index) => {
                        return (
                            <li key={index}>
                                <a className={location.pathname === item.path ? "menu-active" : ''} onClick={() => navigate({ to: item.path })}>
                                    {item.name}
                                </a>
                            </li>
                        );
                    })}

                </ul>
                <div>
                    {children}
                </div>
            </div>
            <div className="hidden md:inline-flex md:w-1.5xl md:flex-col md:p-6 md:items-start gap-3">
                <Avatar imageUrl={user?.image ?? ''} username={user?.username ?? ''} />
                <p className="font-bold text-lg">{user?.username}</p>
                <Link to='/me/settings' className="text-green-500 hover:text-black">{t('profile.editProfile')}</Link>
            </div>
        </div>
    );
}
