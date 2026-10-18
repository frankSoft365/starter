import type { CursorPage } from "@/types/comment";
import type { DeleteRequest } from "@/types/DeleteRequest";
import type {
  AddNoteRequest,
  EditNoteRequest,
  RemoveNoteRequest,
  RepostCount,
  RepostCountQuery,
  RepostListItem,
  RepostRequest,
  RepostState,
  RepostStateQuery,
  UserRepostListQuery,
} from "@/types/repost";
import request from "@/utils/request";

export async function getRepostCountByIds({
  params,
}: {
  params: RepostCountQuery;
}) {
  return request.post<RepostCountQuery, RepostCount[]>("/repost/count", params);
}

export async function getRepostState({ params }: { params: RepostStateQuery }) {
  return request.post<RepostStateQuery, RepostState>("/repost/state", params);
}

export async function repostAnArticle({ params }: { params: RepostRequest }) {
  return request.post<RepostRequest, void>("/repost/post", params);
}

export async function deleteRepost({ params }: { params: DeleteRequest }) {
  return request.post<DeleteRequest, void>("/repost/delete", params);
}

export async function addNote({ params }: { params: AddNoteRequest }) {
  return request.post<AddNoteRequest, void>("/repost/addNote", params);
}

export async function editNote({ params }: { params: EditNoteRequest }) {
  return request.post<EditNoteRequest, void>("/repost/editNote", params);
}

export async function removeNote({ params }: { params: RemoveNoteRequest }) {
  return request.post<RemoveNoteRequest, void>("/repost/removeNote", params);
}

export async function userRepostsQuery({
  params,
}: {
  params: UserRepostListQuery;
}) {
  return request.post<UserRepostListQuery, CursorPage<RepostListItem>>(
    "/repost/list",
    params,
  );
}
