import Loading from "@/ui/Loading";
import Avatar from "@/ui/Avatar";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getNotificationList, markAsRead as markNotificationAsRead } from "@/services/apiNotification";
import type { CursorPageRequest } from "@/types/comment";
import type { ReplyNotificationVO, UnreadCountVO } from "@/types/notification";
import { useRouter } from "@tanstack/react-router";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import { useAtom } from "jotai";
import { unreadCountAtom } from "@/atoms/notification";


type NotificationListType = 'reply' | 'like' | 'follow';
type NotificationItem = ReplyNotificationVO;
const replyNotificationTextMap = {
    ARTICLE: 'commented to my article',
    COMMENT: 'reply to my comment',
}

export default function NotificationList({
    type,
}: {
    type: NotificationListType,
}) {
    const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
    const router = useRouter();

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

    const hasMarkedRead = useRef(false);

    useEffect(() => {
        if (!hasMarkedRead.current && data && data.pages[0]?.items?.length > 0) {
            const firstNotificationId = data.pages[0].items[0].id;
            markNotificationAsRead(type, firstNotificationId);
            setUnreadCount({
                ...unreadCount,
                replyCount: '0'
            } as UnreadCountVO);
            hasMarkedRead.current = true;
        }
    }, [data]);

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
        const url = router.buildLocation({
            to: articleRoute.to,
            params: { articleId: notification.article.id },
            hash: `reply${notification.targetId}`,
        }).href;

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
            {status === 'error' && <p>Error: {error.message}</p>}
            {status === 'success' && (
                notificationItems.length > 0 ?
                    <ul className="list space-y-3">
                        {notificationItems.map((notification, index) => {
                            const replyNotification = type === 'reply' ? notification as ReplyNotificationVO : notification as ReplyNotificationVO;

                            return (
                                <>
                                    {index !== 0 && notification.id === watermarkRef.current && <div className="divider">Last time I saw this</div>}
                                    <NotificationRow notification={notification} >
                                        <li
                                            key={notification.id}
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
                                                        {replyNotificationTextMap[notification.targetType]}
                                                    </span>
                                                </div>
                                                {/* core content */}
                                                {type === 'reply' && replyNotification && (
                                                    <div className="text-lg my-2 py-2">
                                                        {replyNotification.parentComment && replyNotification.parentComment.parentId
                                                            ?
                                                            <span className='opacity-60'>
                                                                <em> reply to </em>
                                                                <span className="text-blue-500">
                                                                    {replyNotification.reply.replyToUsername}
                                                                </span>
                                                                <span> : </span>
                                                            </span>
                                                            : null
                                                        }
                                                        {replyNotification.reply.content}
                                                    </div>
                                                )}
                                                {/* parent comment but not root comment */}
                                                {type === 'reply' && replyNotification && replyNotification.parentComment && replyNotification.parentComment.parentId && (
                                                    <div className="text-xs bg-base-300 p-2 opacity-70 mb-1">
                                                        <span>{`${replyNotification.parentComment.username} : `}</span>
                                                        <span>{replyNotification.parentComment.parentId !== replyNotification.rootComment.id && `reply to ${replyNotification.parentComment.replyToUsername} : `}</span>
                                                        <span>{replyNotification.parentComment.content}</span>
                                                    </div>
                                                )}
                                                <span className="text-xs text-gray-500">
                                                    {new Date(notification.createTime).toLocaleString()}
                                                </span>
                                            </div>
                                            {type === 'reply' && replyNotification && <div className="font-bold w-24 md:w-32">
                                                {notification.targetType === 'ARTICLE' &&
                                                    <div>
                                                        <span className="opacity-70 text-xs">related article : </span>
                                                        <span>{replyNotification.article.title}</span>
                                                    </div>
                                                }
                                                {notification.targetType === 'COMMENT' &&
                                                    <div>
                                                        <span className="opacity-70 text-xs">related rootComment : </span>
                                                        <span>{replyNotification.rootComment.content}</span>
                                                    </div>
                                                }
                                            </div>}
                                        </li>
                                    </NotificationRow>

                                </>
                            );
                        })}
                        <li ref={notificationListBottomRef} className="list-row h-0.5" aria-hidden></li>
                        {isFetchingNextPage && <li className="list-row">Loading more…</li>}
                        {!hasNextPage && <li className="list-row text-center p-5">No more notifications.</li>}
                    </ul>
                    :
                    <div className="h-48 text-gray-500 text-center p-5">
                        There are no notifications for this category yet.
                    </div>
            )}
        </div>
    );
}
