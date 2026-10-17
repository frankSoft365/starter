import type { DeleteRequest } from "@/types/DeleteRequest";
import type {
  UserArticleListRequest,
  ArticlePublishRequest,
  ArticleUpdateRequest,
  HomeArticleListRequest,
  OperationList,
  ArticlePreview,
  ArticleDetail,
  OperationResult,
  ArticleSetPinnedByCreatorAtRequest,
} from "../types/article";
import request from "../utils/request";
import type { CursorPage } from "@/types/comment";

export async function publishArticle(params: ArticlePublishRequest) {
  return request.post<ArticlePublishRequest, string>(
    "/article/user/publish",
    params,
  );
}

export async function getPublicHomeArticleList({
  params,
}: {
  params: HomeArticleListRequest;
}) {
  return request.post<HomeArticleListRequest, CursorPage<ArticlePreview>>(
    "/article/public/home/list",
    params,
  );
}

export async function getUserArticleList({
  params,
}: {
  params: UserArticleListRequest;
}) {
  return request.post<UserArticleListRequest, CursorPage<ArticlePreview>>(
    "/article/user/list",
    params,
  );
}

export async function getArticleById(id: string) {
  return request.get<void, ArticleDetail>(`/article/public/${id}`);
}

export async function updateArticle(params: ArticleUpdateRequest) {
  return request.post<ArticleUpdateRequest, void>(
    "/article/user/update",
    params,
  );
}

export async function deleteArticle(params: DeleteRequest) {
  return request.post<DeleteRequest, void>("/article/user/delete", params);
}

export async function batchOperationRequest({
  params,
}: {
  params: OperationList;
}) {
  return request.post<OperationList, OperationResult[]>(
    "/article/articleResult",
    params,
  );
}

export async function articleSetPinnedByCreatorAt({
  params,
}: {
  params: ArticleSetPinnedByCreatorAtRequest;
}) {
  return request.post<ArticleSetPinnedByCreatorAtRequest, void>(
    "/article/pinByCreator",
    params,
  );
}
