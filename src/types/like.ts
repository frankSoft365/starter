export type LikeActionRequest = {
    targetType: 1 | 2;
    targetId: string;
    action: 1 | 2;
};

export type LikeBatchStatusRequest = {
    targetType: 1 | 2;
    targetIds: string[];
};

export type LikeBatchStatusResponse = {
    likedMap: Record<string, boolean>;
};
