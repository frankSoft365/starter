export type CursorPage<T> = {
    items: T[];
    hasMore: boolean;
    nextCursorCreatedAt: Date | null;
    nextCursorId: string | null;
}

export type CommentThreadDTO = {
    root: CommentView;
    replyPreview: CommentView[];
    totalReplyCount: number;
    hasMoreReplies: boolean;
}

export type CommentView = {
    id: string;

    userId: string;
    username: string | null; // null when comment is deleted
    userAvatar: string | null; // null when comment is deleted

    content: string;

    parentId: string;

    replyToUserId: string | null; // null for root comments
    replyToUsername: string | null;

    createdAt: Date;
}

export type CreateCommentRequest = {
    content: string;
    parentId?: string | null; // null/omitted = new root comment
}

export type AddCommentResponse = {
    commentView: CommentView;
    rootId: string;
}

export type CursorPageRequest = {
    lastCreatedAt: Date | null;
    lastId: string | null;
    size?: number;
}