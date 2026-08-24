import { Route as followersRoute } from "@/routes/_app/_protected/profile/$userId/followers";
import { Route as followingRoute } from "@/routes/_app/_protected/profile/$userId/following";
import type { FollowListType } from "@/types/follow";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export default function FollowStats({
    userId,
    followerCount = 0,
    followingCount = 0,
    type = 'both',
    withLinks = true,
    className = '',
}: {
    userId?: string;
    followerCount?: number;
    followingCount?: number;
    type?: FollowListType | 'both';
    withLinks?: boolean;
    className?: string;
}) {
    const { t } = useTranslation();

    const renderStat = (statType: FollowListType, count: number) => {
        const text = t(statType === 'followers' ? 'profile.followers' : 'profile.following', { count });

        if (!withLinks || !userId) {
            return text;
        }

        const route = statType === 'followers' ? followersRoute : followingRoute;
        return (
            <Link className="link link-hover" to={route.to} params={{ userId }}>
                {text}
            </Link>
        );
    };

    return (
        <span className={`inline-flex flex-wrap items-center ${className}`}>
            {type !== 'following' && renderStat('followers', followerCount)}
            {type === 'both' && <span className="text-base-content mx-3">·</span>}
            {type !== 'followers' && renderStat('following', followingCount)}
        </span>
    );
}
