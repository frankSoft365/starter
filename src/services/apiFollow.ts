import type { FollowActionRequest, FollowBatchStatusRequest, FollowBatchStatusResponse, FollowListType, FollowUserListRequest, FollowUserListResponse } from "@/types/follow";
import request from "@/utils/request";

export async function getFollowBatchStatus(params: FollowBatchStatusRequest) {
    return request.post<FollowBatchStatusRequest, FollowBatchStatusResponse>('/follow/batch-status', params);
}

export async function updateFollow(params: FollowActionRequest) {
    return request.post<FollowActionRequest, void>('/follow/action', params);
}

export async function getFollowUserList(type: FollowListType, params: FollowUserListRequest) {
    const { lastCreatedAt, lastId, ...baseParams } = params;
    const queryParams = lastCreatedAt && lastId
        ? { ...baseParams, lastCreatedAt, lastId }
        : baseParams;

    return request.get<void, FollowUserListResponse>(`/follow/${type}`, { params: queryParams });
}
