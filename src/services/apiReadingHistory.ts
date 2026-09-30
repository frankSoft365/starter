import type { ArticleListItemVO } from "@/types/article";
import type { CursorPage } from "@/types/comment";
import type { DeleteRequest } from "@/types/DeleteRequest";
import type {
  ReadingHistoryQuery,
  RecordReadingHistoryRequest,
} from "@/types/readingHistory";
import request from "@/utils/request";

export async function getReadingHistoryList({
  params,
}: {
  params: ReadingHistoryQuery;
}) {
  return request.post<ReadingHistoryQuery, CursorPage<ArticleListItemVO>>(
    "/reading-history/list",
    params,
  );
}

export async function saveReadingHistory({
  params,
}: {
  params: RecordReadingHistoryRequest;
}) {
  return request.post<RecordReadingHistoryRequest, void>(
    "/reading-history/save",
    params,
  );
}

export async function clearAllReadingHistory() {
  return request.post<void, void>("/reading-history/clear");
}

export async function deleteOneReadingHistory(params: DeleteRequest) {
  return request.post<DeleteRequest, void>("/reading-history/delete", params);
}
