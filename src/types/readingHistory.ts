export type ReadingHistoryQuery = {
  lastCreatedAt: Date | null;
  lastId: string | null;
  size?: number;
};

export type RecordReadingHistoryRequest = {
  articleId: string;
};
