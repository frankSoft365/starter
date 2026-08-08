import request from "../utils/request";
import type { LikeActionRequest, LikeBatchStatusRequest, LikeBatchStatusResponse } from "@/types/like";

export async function likeAction(params: LikeActionRequest) {
    return request.post<LikeActionRequest, void>('/like/action', params);
}

export async function getLikeBatchStatus(params: LikeBatchStatusRequest) {
    return request.post<LikeBatchStatusRequest, LikeBatchStatusResponse>('/like/batch-status', params);
}
