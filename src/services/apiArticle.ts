import type { DeleteRequest } from "@/types/DeleteRequest";
import type {
  ArticleListItemVO,
  UserArticleListRequest,
  ArticlePublishRequest,
  ArticleUpdateRequest,
  ArticleVO,
  HomeArticleListRequest,
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
  return request.post<HomeArticleListRequest, CursorPage<ArticleListItemVO>>(
    "/article/public/home/list",
    params,
  );
}

export async function getUserArticleList(params: UserArticleListRequest) {
  return request.post<UserArticleListRequest, ArticleListItemVO[]>(
    "/article/user/list",
    params,
  );
}

export async function getArticleById(id: string) {
  return request.get<void, ArticleVO>(`/article/public/${id}`);
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
