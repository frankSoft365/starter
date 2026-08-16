import Loading from "@/ui/Loading";
import Avatar from "@/ui/Avatar";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getNotificationList, markAsRead as markNotificationAsRead } from "@/services/apiNotification";
import type { CursorPageRequest } from "@/types/comment";
import type { LikeNotificationVO, NotificationVO, ReplyNotificationVO, UnreadCountVO } from "@/types/notification";
import { useRouter } from "@tanstack/react-router";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import { useSetAtom } from "jotai";
import { unreadCountAtom } from "@/atoms/notification";
import { useTranslation } from "react-i18next";


type NotificationListType = 'reply' | 'like' | 'follow';
export type NotificationItem = ReplyNotificationVO | LikeNotificationVO;

const notificationActionTextMap: Record<NotificationVO['type'], string> = {
    NEW_COMMENT: 'notification.action.commentedArticle',
    NEW_REPLY: 'notification.action.repliedComment',
    LIKE_ARTICLE: 'notification.action.likedArticle',
    LIKE_COMMENT: 'notification.action.likedComment',
};

function isReplyNotification(n: NotificationItem): n is ReplyNotificationVO {
    return n.type === 'NEW_COMMENT' || n.type === 'NEW_REPLY';
}

function isLikeNotification(n: NotificationItem): n is LikeNotificationVO {
    return n.type === 'LIKE_ARTICLE' || n.type === 'LIKE_COMMENT';
}

const unreadCountFieldMap: Record<NotificationListType, keyof UnreadCountVO> = {
    reply: 'replyCount',
    like: 'likeCount',
    follow: 'followCount',
};

export default function NotificationList({
    type,
}: {
    type: NotificationListType,
}) {
    const setUnreadCount = useSetAtom(unreadCountAtom);
    const router = useRouter();
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const watermarkRef = useRef<string | null>(null);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['notification-list', type],
        queryFn: async ({ pageParam }: { pageParam: CursorPageRequest }) => {
            const watermarkVar = watermarkRef.current !== null ? `&watermark=${watermarkRef.current}` : null;
            const page = await getNotificationList(type, pageParam, watermarkVar);

            if (watermarkRef.current === null) {
                watermarkRef.current = page.watermark; // synchronous, no batching risk
            }
            return page;
        },
        initialPageParam: {
            lastCreatedAt: null,
            lastId: null,
        } as CursorPageRequest,
        getNextPageParam: (lastPage) => {
            if (!lastPage.hasMore) {
                return undefined;
            }

            return {
                lastCreatedAt: lastPage.nextCursorCreatedAt,
                lastId: lastPage.nextCursorId,
            };
        },
    });

    // ensure the markAsRead only once
    const hasMarkedRead = useRef(false);
    const lastMarkedId = useRef<string | null>(null);
    const latestSeenId = useRef<string | null>(null);

    const clearUnread = () => {
        setUnreadCount(prev => ({
            ...prev,
            [unreadCountFieldMap[type]]: '0'
        }));
    };

    useEffect(() => {
        if (!hasMarkedRead.current && data && data.pages[0]?.items?.length > 0) {
            const firstNotificationId = data.pages[0].items[0].id;
            markNotificationAsRead(type, firstNotificationId);
            clearUnread();
            hasMarkedRead.current = true;
        }
    }, [data]);

    useEffect(() => {
        if (data && data.pages[0]?.items?.length > 0) {
            latestSeenId.current = data.pages[0].items[0].id;
        }
    }, [data]);

    useEffect(() => {
        return () => {
            if (latestSeenId.current !== null && latestSeenId.current !== lastMarkedId.current) {
                markNotificationAsRead(type, latestSeenId.current);
                clearUnread();
            }
        };
    }, [type]);

    const notificationListBottomRef = useRef<HTMLLIElement | null>(null);

    useEffect(() => {
        const ref = notificationListBottomRef.current;
        if (!ref) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && hasNextPage && !isFetching) {
                fetchNextPage();
            }
        }, { rootMargin: '200px' });

        observer.observe(ref);
        return () => observer.disconnect();
    }, [hasNextPage, isFetching, fetchNextPage]);

    const notificationItems = data?.pages.flatMap((page) => page.items as NotificationItem[]) ?? [];

    function NotificationRow({ notification, children }: { notification: NotificationItem, children: React.ReactNode }) {
        const hash = notification.type === 'LIKE_ARTICLE' ? undefined : `reply${notification.targetId}`;
        const url = notification.article
            ? router.buildLocation({
                to: articleRoute.to,
                params: { articleId: notification.article.id },
                ...(hash && { hash }),
            }).href
            : undefined;

        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        );
    }

    return (
        <div className="w-full">
            {status === 'pending' && <Loading />}
            {status === 'error' && (
                <div className="flex flex-col items-center justify-center gap-3 p-6">
                    <p className="text-red-500">
                        {t('common.error')}: {error.message}
                    </p>
                    <button onClick={() => queryClient.invalidateQueries({ queryKey: ['notification-list', type] })} className="btn btn-sm btn-outline">
                        {t('common.retry')}
                    </button>
                </div>
            )}
            {status === 'success' && (
                notificationItems.length > 0 ?
                    <ul className="list space-y-3">
                        {notificationItems.map((notification, index) => {
                            return (
                                <div key={notification.id}>
                                    {index !== 0 && notification.id === watermarkRef.current && <div className="divider">{t('notification.watermark')}</div>}
                                    <NotificationRow notification={notification} >
                                        <li
                                            className='list-row'
                                        >
                                            <div className="indicator">
                                                {notification.isNew === 0 && <span className="indicator-item status status-error"></span>}
                                                <div className="grid h-10 w-10 place-items-center">
                                                    <Avatar
                                                        imageUrl={notification.actorAvatar || undefined}
                                                        username={notification.actorUsername || ''}
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm">
                                                    <span className="font-semibold mr-3">
                                                        {notification.actorUsername}
                                                    </span>
                                                    <span className="opacity-65">
                                                        {t(notificationActionTextMap[notification.type])}
                                                    </span>
                                                </div>
                                                {/* core content - reply only */}
                                                {isReplyNotification(notification) && (
                                                    <div className="text-lg my-2 py-2">
                                                        {notification.parentComment && notification.parentComment.parentId
                                                            ?
                                                            <span className='opacity-60'>
                                                                <em> {t('notification.replyTo')} </em>
                                                                <span className="text-blue-500">
                                                                    {notification.reply.replyToUsername}
                                                                </span>
                                                                <span> : </span>
                                                            </span>
                                                            : null
                                                        }
                                                        {notification.reply.content}
                                                    </div>
                                                )}
                                                {/* parent comment but not root comment - reply only */}
                                                {isReplyNotification(notification) && notification.parentComment && notification.parentComment.parentId && (
                                                    <div className="text-xs bg-base-300 p-2 opacity-70 mb-1">
                                                        <span>{`${notification.parentComment.username} : `}</span>
                                                        <span>{notification.parentComment.parentId !== notification.rootComment.id && `${t('notification.replyTo')} ${notification.parentComment.replyToUsername} : `}</span>
                                                        <span>{notification.parentComment.content}</span>
                                                    </div>
                                                )}
                                                <span className="text-xs opacity-60">
                                                    {new Date(notification.createTime).toLocaleString()}
                                                </span>
                                            </div>
                                            {/* right column */}
                                            <div className="font-bold w-24 md:w-32">
                                                {isReplyNotification(notification) && (
                                                    <>
                                                        {notification.targetType === 'ARTICLE' &&
                                                            <div>
                                                                <span className="opacity-70 text-xs">{t('notification.relatedArticle')} </span>
                                                                {notification.article ? <span>{notification.article.title}</span> : <span className="text-red-600">该文章已被删除</span>}
                                                            </div>
                                                        }
                                                        {notification.targetType === 'COMMENT' &&
                                                            <div>
                                                                <span className="opacity-70 text-xs">{t('notification.relatedRootComment')} </span>
                                                                <span>{notification.rootComment.content}</span>
                                                            </div>
                                                        }
                                                    </>
                                                )}
                                                {isLikeNotification(notification) && (
                                                    <>
                                                        {notification.type === 'LIKE_ARTICLE' &&
                                                            <div>
                                                                <span className="opacity-70 text-xs">{t('notification.relatedArticle')} </span>
                                                                {notification.article ? <span>{notification.article.title}</span> : <span className="text-red-600">该文章已被删除</span>}
                                                            </div>
                                                        }
                                                        {notification.type === 'LIKE_COMMENT' && notification.comment &&
                                                            <div>
                                                                <span className="opacity-70 text-xs">{t('notification.relatedRootComment')} </span>
                                                                <span>{notification.comment.content}</span>
                                                            </div>
                                                        }
                                                    </>
                                                )}
                                            </div>
                                        </li>
                                    </NotificationRow>

                                </div>
                            );
                        })}
                        <li ref={notificationListBottomRef} className="list-row h-0.5" aria-hidden></li>
                        {isFetchingNextPage && <li className="list-row">{t('common.loadingMore')}</li>}
                        {!hasNextPage && <li className="list-row h-24 text-center p-5">{t('notification.noMore')}</li>}
                    </ul>
                    :
                    <div className="h-48 opacity-60 text-center p-5">
                        {t('notification.empty')}
                    </div>
            )}
        </div>
    );
}
