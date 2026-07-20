import request from "../utils/request";
import type { AddCommentResponse, CommentThreadDTO, CommentView, CreateCommentRequest, CursorPage, CursorPageRequest } from '@/types/comment';

export async function getRootComments({
    params,
    articleId
}: {
    params: CursorPageRequest,
    articleId: string
}) {
    return request.post<CursorPageRequest, CursorPage<CommentThreadDTO>>(`/article/${articleId}/comment/getList`, params);
}

export async function addComment({
    params,
    articleId
}: {
    params: CreateCommentRequest,
    articleId: string
}) {
    return request.post<CreateCommentRequest, AddCommentResponse>(`/article/${articleId}/comment/addComment`, params);
}

export async function getRepliesForRootComment({
    params,
    articleId,
    rootId
}: {
    params: CursorPageRequest,
    articleId: string,
    rootId: string
}) {
    return request.post<CursorPageRequest, CursorPage<CommentView>>(`/article/${articleId}/comment/getRepliesForRoot/${rootId}`, params);
}