export interface NotificationVO {
    id: string;
    recipientId: string;
    actorId: string;
    actorAvatar: string | null;
    actorUsername: string | null;
    type: 'NEW_COMMENT' | 'NEW_REPLY' | 'LIKE_ARTICLE' | 'LIKE_COMMENT' | 'NEW_FOLLOWER';
    targetType: 'ARTICLE' | 'COMMENT' | 'USER';
    targetId: string;
    isNew: number; // 0 is new ; 1 is old
    createTime: string;
}

export interface ReplyNotificationVO extends NotificationVO {
    rootComment: CommentBriefDTO;
    parentComment: CommentBriefDTO;
    reply: CommentBriefDTO;
    article: ArticleBriefDTO;
}

export interface LikeNotificationVO extends NotificationVO {
    article: ArticleBriefDTO;
    comment: CommentBriefDTO | null;
}

export interface FollowNotificationVO extends NotificationVO {
    type: 'NEW_FOLLOWER';
    targetType: 'USER';
}

export type UnreadCountVO = {
    replyCount: string;
    likeCount: string;
    followCount: string;
}

export type NotificationPushEvent<T extends NotificationVO> = {
    recipientId: string;
    type: string;
    unreadCount: string;
    notificationVO: T;
}

export type NotificationCursorPage<T> = {
    items: T[];
    watermark: string;
    hasMore: boolean;
    nextCursorCreatedAt: Date | null;
    nextCursorId: string | null;
}

export interface CommentBriefDTO {
    id: string;
    userId: string;
    username: string;
    content: string;
    parentId: string;
    replyToUserId: string;
    replyToUsername: string;
}

export interface ArticleBriefDTO {
    id: string;
    title: string;
}
