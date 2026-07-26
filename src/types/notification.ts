export interface NotificationVO {
    id: string;
    recipientId: string;
    actorId: string;
    actorAvatar: string;
    actorUsername: string;
    type: 'NEW_COMMENT' | 'NEW_REPLY';
    targetType: 'ARTICLE' | 'COMMENT';
    targetId: string;
    isNew: number; // 0 is new ; 1 is old
    createTime: string;
}

export type UnreadCountVO = {
    replyCount: string;
    likeCount: string;
    followCount: string;
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


export interface ReplyNotificationVO extends NotificationVO {
    rootComment: CommentBriefDTO;
    parentComment: CommentBriefDTO;
    reply: CommentBriefDTO;
    article: ArticleBriefDTO;
}
