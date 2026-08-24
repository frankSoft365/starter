import FollowButton from "@/features/follow/FollowButton";
import { useFollowStatuses, useInfiniteFollowUserList } from "@/features/follow/follow";
import { Route as profileRoute } from "@/routes/_app/_protected/profile/$userId/_profile/index";
import type { FollowListType } from "@/types/follow";
import type { UserVO } from "@/types/user";
import Avatar from "@/ui/Avatar";
import CurrentUser from "@/ui/CurrentUser";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

function FollowListSkeleton() {
    return (
        <ul className="list bg-base-100">
            {Array.from({ length: 6 }, (_, index) => (
                <li key={index} className="list-row items-center">
                    <div className="skeleton h-10 w-10 rounded-full"></div>
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton ml-auto h-8 w-24 rounded-full"></div>
                </li>
            ))}
        </ul>
    );
}

export default function FollowUserList({
    userId,
    type,
}: {
    userId: string;
    type: FollowListType;
}) {
    const { t } = useTranslation();
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
        status,
    } = useInfiniteFollowUserList(userId, type);
    const users = useMemo(() => {
        const userMap = new Map<string, UserVO>();
        data?.pages.flatMap(page => page.items).forEach(user => userMap.set(user.id, user));
        return [...userMap.values()];
    }, [data]);
    const {
        data: followStatusMap = {},
        isFetching: isFollowStatusFetching,
        isError: isFollowStatusError,
        retry: retryFollowStatus,
    } = useFollowStatuses(users.map(user => user.id), status === 'success');
    const listBottomRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const element = listBottomRef.current;
        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasNextPage && !isFetching) {
                void fetchNextPage();
            }
        }, { rootMargin: '200px' });

        observer.observe(element);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetching]);

    if (status === 'pending') {
        return <FollowListSkeleton />;
    }

    if (status === 'error') {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
                <p className="text-error">{t('common.error')}: {error.message}</p>
                <button type="button" className="btn btn-sm btn-outline" onClick={() => void refetch()}>
                    {t('common.retry')}
                </button>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="py-12 text-center opacity-60">
                {t(type === 'followers' ? 'profile.followList.emptyFollowers' : 'profile.followList.emptyFollowing')}
            </div>
        );
    }

    return (
        <ul className="list bg-base-100 mt-4">
            {users.map(user => (
                <li key={user.id} className="list-row items-center">
                    <Link to={profileRoute.to} params={{ userId: user.id }}>
                        <Avatar imageUrl={user.image ?? undefined} username={user.username} size="sm" hover />
                    </Link>
                    <div className="min-w-0">
                        <Link
                            className="link link-hover block truncate font-semibold"
                            to={profileRoute.to}
                            params={{ userId: user.id }}
                        >
                            {user.username}
                        </Link>
                    </div>
                    <div className="ml-auto">
                        <CurrentUser
                            authorId={user.id}
                            fallback={(
                                <FollowButton
                                    userId={user.id}
                                    className="btn-sm"
                                    pendingVariant="skeleton"
                                    status={{
                                        isFollowing: followStatusMap[user.id] ?? false,
                                        isPending: isFollowStatusFetching,
                                        isError: isFollowStatusError,
                                        onRetry: () => void retryFollowStatus(),
                                    }}
                                />
                            )}
                        />
                    </div>
                </li>
            ))}
            <li ref={listBottomRef} className="h-px" aria-hidden></li>
            {isFetchingNextPage && (
                <li className="py-4 text-center opacity-60">{t('common.loadingMore')}</li>
            )}
            {!hasNextPage && (
                <li className="py-4 text-center opacity-60">{t('profile.followList.noMore')}</li>
            )}
        </ul>
    );
}
