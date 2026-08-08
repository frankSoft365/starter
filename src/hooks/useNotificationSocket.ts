import { useEffect, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import { unreadCountAtom } from '@/atoms/notification';
import type { NotificationCursorPage, NotificationPushEvent, ReplyNotificationVO } from '@/types/notification';
import { getStompClient } from '@/utils/wsClient';
import { useQueryClient } from '@tanstack/react-query';
import type { CursorPageRequest } from '@/types/comment';
import type { NotificationItem } from '@/features/notifications/NotificationList';

export function useNotificationSocket() {
    const setUnreadCount = useSetAtom(unreadCountAtom);
    const queryClient = useQueryClient();

    const handleIncoming = useCallback((message: { body: string }) => {
        const payload: NotificationPushEvent<NotificationItem> = JSON.parse(message.body);
        if (payload.type === 'reply') {
            setUnreadCount((prev) => ({
                ...prev,
                replyCount: payload.unreadCount
            }));

            queryClient.setQueryData(
                ['notification-list', 'reply'],
                (old: { pages: NotificationCursorPage<ReplyNotificationVO>[]; pageParams: CursorPageRequest[] } | undefined) => {
                    if (!old) return old;

                    const alreadyExists = old.pages.some((p) =>
                        p.items.some((n) => n.id === payload.notificationVO.id)
                    );
                    if (alreadyExists) return old;

                    const [firstPage, ...restPages] = old.pages;
                    return {
                        ...old,
                        pages: [
                            { ...firstPage, items: [payload.notificationVO, ...firstPage.items] },
                            ...restPages,
                        ],
                    };
                }
            );
        } else if (payload.type === 'like') {
            setUnreadCount((prev) => ({
                ...prev,
                likeCount: payload.unreadCount
            }));
        }
    }, [setUnreadCount, queryClient]);

    useEffect(() => {
        const client = getStompClient();
        let subscription: ReturnType<typeof client.subscribe> | undefined;

        const subscribe = () => {
            subscription = client.subscribe('/user/queue/notifications', handleIncoming);
        };

        if (client.connected) {
            subscribe();
        } else {
            client.onConnect = subscribe;
        }

        return () => subscription?.unsubscribe();
    }, [handleIncoming]);
}