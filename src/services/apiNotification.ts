import type { CursorPageRequest } from "@/types/comment";
import request from "../utils/request";
import type { NotificationCursorPage, ReplyNotificationVO, UnreadCountVO } from "@/types/notification";

type NotificationListType = 'reply' | 'like' | 'follow';
type NotificationListPage<T extends NotificationListType> =
    T extends 'reply'
    ? NotificationCursorPage<ReplyNotificationVO>
    : NotificationCursorPage<ReplyNotificationVO>;

export async function getNotificationList<T extends NotificationListType>(type: T, params: CursorPageRequest, watermarkVar: string | null): Promise<NotificationListPage<T>> {
    return request.post<CursorPageRequest, NotificationListPage<T>>(`/notifications/getList?type=${type}${watermarkVar ? watermarkVar : ''}`, params);
}

export async function getUnreadCount() {
    return request.get<void, UnreadCountVO>('/notifications/unread-count');
}

export async function markAsRead(type: string, maxNotificationId: string) {
    return request.post<void, void>(`/notifications/mark-read?type=${type}&maxNotificationId=${maxNotificationId}`);
}