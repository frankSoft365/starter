import { Route as profileRoute } from "@/routes/_app/_protected/profile/$userId/_profile/index";
import type { FollowListType } from "@/types/follow";
import Loading from "@/ui/Loading";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useProfile } from "../account/userProfile";
import FollowStats from "../follow/FollowStats";
import FollowUserList from "./FollowUserList";

export default function FollowListPage({
    userId,
    type,
}: {
    userId: string;
    type: FollowListType;
}) {
    const { t } = useTranslation();
    const {
        user,
        isUserProfileLoading,
        isLoadingError,
        error,
        retryUserProfile,
    } = useProfile(userId);

    if (isUserProfileLoading) {
        return <Loading />;
    }

    if (isLoadingError) {
        return (
            <main className="flex min-h-48 flex-col items-center justify-center gap-3">
                <p className="text-error">
                    {t('common.error')}: {error?.message}
                </p>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => void retryUserProfile()}>
                    {t('common.retry')}
                </button>
            </main>
        );
    }

    return (
        <main className="w-full max-w-3xl mx-auto px-4 py-2 md:py-6">
            <div className="breadcrumbs md:text-lg">
                <ul>
                    <li className="opacity-65">
                        <Link to={profileRoute.to} params={{ userId }}>
                            {user?.username || t('profile.unknownUsername')}
                        </Link>
                    </li>
                    <li>{t(type === 'followers' ? 'profile.followersTitle' : 'profile.followingTitle')}</li>
                </ul>
            </div>
            <FollowStats
                followerCount={user?.followerCount}
                followingCount={user?.followingCount}
                type={type}
                withLinks={false}
                className="text-2xl md:text-4xl font-bold"
            />
            <FollowUserList userId={userId} type={type} />
        </main>
    );
}
