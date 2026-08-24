import type { UserVO } from "./user";

export type FollowBatchStatusRequest = {
    targetUserIds: string[];
}

export type FollowBatchStatusResponse = {
    followingMap: Record<string, boolean>;
}

export type FollowAction = 1 | 2;

export type FollowActionRequest = {
    targetUserId: string;
    action: FollowAction;
}

export type FollowListType = 'followers' | 'following';

export type FollowUserListRequest = {
    userId: string;
    lastCreatedAt?: string | null;
    lastId?: string | null;
    size?: number;
}

export type FollowUserListResponse = {
    items: UserVO[];
    hasMore: boolean;
    nextCursorCreatedAt: string | null;
    nextCursorId: string | null;
}
