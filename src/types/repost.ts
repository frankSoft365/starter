import type { ArticlePreview } from "./article";

export type RepostCount = {
  id: string;
  repostCount: number;
};

export type RepostCountQuery = {
  ids: string[];
};

export type RepostStateQuery = {
  articleId: string;
};

export type RepostState = {
  userId: string;
  articleId: string;
  hasReposted: boolean;
  note: string | null;
};

export type RepostRequest = {
  articleId: string;
  note?: string;
};

export type AddNoteRequest = {
  articleId: string;
  note: string;
};

export type EditNoteRequest = {
  articleId: string;
  note: string;
};

export type RemoveNoteRequest = {
  articleId: string;
};

export type UserRepostListQuery = {
  lastCreatedAt: Date | null;
  lastId: string | null;
  size?: number;

  userId: string;
};

export type UserRepost = {
  userId: string;
  articleId: string;
  note: string | null;
  createTime: Date;
};

export type RepostListItem = {
  repost: UserRepost;
  post: ArticlePreview;
};
