import Avatar from "@/ui/Avatar";
import { ProfileUserProvider } from './ProfileUserContext'
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { Route as homeRoute } from "@/routes/_app/_protected/profile/$userId/_profile/index";
import { Route as repostsRoute } from "@/routes/_app/_protected/profile/$userId/_profile/reposts";
import { Route as activityRoute } from "@/routes/_app/_protected/profile/$userId/_profile/activity";
import { Route as listsRoute } from "@/routes/_app/_protected/profile/$userId/_profile/lists";
import { Route as aboutRoute } from "@/routes/_app/_protected/profile/$userId/_profile/about";
import { useTranslation } from "react-i18next";
import { useProfile } from "../account/userProfile";
import { Route as profileTabRoute } from "@/routes/_app/_protected/profile/$userId/_profile/route";
import Loading from "@/ui/Loading";
import { handleShareCopyLink } from "@/utils/copyHelper";
import CurrentUser from "@/ui/CurrentUser";
import FollowStats from "../follow/FollowStats";
import FollowButton from "../follow/FollowButton";

export default function ProfileTab({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const { userId } = profileTabRoute.useParams();
    const { user, isUserProfileLoading, isLoadingError, error } = useProfile(userId);
    const location = useLocation();
    const navigate = useNavigate();

    const url = `${window.location.origin}/profile/${userId}`;

    const profileTabMap = [
        { name: t('profile.tab.home'), path: homeRoute.to },
        { name: t('profile.tab.reposts'), path: repostsRoute.to },
        { name: t('profile.tab.activity'), path: activityRoute.to },
        { name: t('profile.tab.lists'), path: listsRoute.to },
        { name: t('profile.tab.about'), path: aboutRoute.to },
    ];

    if (isUserProfileLoading) {
        return <Loading />
    }
    if (isLoadingError) {
        return <main className="flex items-center justify-center min-h-screen">
            <div className="text-3xl text-red-600">
                {error?.message || t('article.list.loadFailed')}
            </div>
        </main>
    }

    return (
        // flex-row layout
        <div className="w-full flex">
            {/* left main layout */}
            <div className="lg:mx-20 w-2xl">
                {/* flex-col layout */}
                <div className="w-full flex flex-col items-center">
                    <div className="flex w-full justify-between px-2 lg:p-0">
                        {/* user info */}
                        <div className="flex p-5 gap-3 px-2">
                            <div className="inline-flex lg:hidden">
                                <Avatar imageUrl={user?.image ?? ''} username={user?.username ?? ''} />
                            </div>
                            <div className="flex flex-col justify-start">
                                <div className="w-full text-xl lg:text-4xl lg:my-4 font-bold">{user?.username || t('profile.unknownUsername')}</div>
                                <FollowStats
                                    userId={userId}
                                    followerCount={user?.followerCount}
                                    type="followers"
                                    className="opacity-60 lg:hidden"
                                />
                            </div>
                        </div>
                        {/* 'more' button */}
                        <div className="flex items-center px-0">
                            <button className="btn btn-square btn-ghost" popoverTarget="popover-profile-more" style={{ anchorName: "--anchor-1" }} >
                                <DotsThreeIcon size={24} weight="bold" />
                            </button>
                            <ul className="dropdown dropdown-end menu w-42 bg-base-100 shadow-lg"
                                popover="auto" id="popover-profile-more" style={{ positionAnchor: "--anchor-1" }}>
                                <li>
                                    <button className="btn btn-ghost justify-start text-xs" onClick={() => handleShareCopyLink(url)}>
                                        {t('profile.menu.copyLink')}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* 'follow' button (show in small screen) */}
                    <CurrentUser
                        authorId={userId}
                        fallback={<FollowButton userId={userId} className="inline-flex lg:hidden w-11/12 mb-3 mx-auto" />}
                    />
                    {/* profile menu */}
                    <ul className="menu w-full bg-base-100 menu-horizontal border-b-2 border-base-300">
                        {profileTabMap.map((item, index) => {
                            return (
                                <li key={index}>
                                    <a className={location.pathname === item.path.replace('$userId', userId) ? "menu-active" : ''} onClick={() => navigate({ to: item.path, params: { userId: userId } })}>
                                        {item.name}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                    {/* outlet */}
                    <ProfileUserProvider user={user}>
                        <div className="w-full">{children}</div>
                    </ProfileUserProvider>
                </div>
            </div>
            {/* right lg-screen-show profile info */}
            <div className="hidden lg:inline-flex lg:grow lg:flex-col lg:p-12 lg:items-start gap-3 lg:border-l-2 lg:border-base-300">
                <Avatar imageUrl={user?.image ?? ''} username={user?.username ?? ''} size="lg" />
                <p className="font-bold text-lg">{user?.username}</p>
                <FollowStats
                    userId={userId}
                    followerCount={user?.followerCount}
                    type="followers"
                    className="opacity-60"
                />
                {/* link to profile edit page */}
                <CurrentUser authorId={userId}>
                    <Link to='/me/settings' className="text-green-500 hover:text-black">{t('profile.editProfile')}</Link>
                </CurrentUser>
                {/* 'follow' button */}
                <CurrentUser
                    authorId={userId}
                    fallback={<FollowButton userId={userId} className="mt-2" />}
                />
            </div>
        </div>
    );
}
