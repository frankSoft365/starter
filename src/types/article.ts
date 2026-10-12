import type { TopicInArticleVO } from "./topic";

export type UserArticleListRequest = {
  userId: string;
  lastCreatedAt: Date | null;
  lastId: string | null;
  size?: number;
};

export type ArticlePublishRequest = {
  title: string;
  subtitle?: string;
  content: string;
  coverImage?: string;
  /** vertical focus point (0-1) for frontend rendering, optional */
  coverFocusY?: number;
  topics: string[];
  status: "published" | "scheduled";
  publishAt?: Date;
};

export type ArticleUpdateRequest = {
  articleId: string;
  content: string;
  title?: string;
  subtitle?: string;
  coverImage?: string;
  coverFocusY?: number;
};

export type ArticlePublishPreview = {
  title: string;
  subtitle: string;
  content: string;
  coverImage: string[];
};

export type ArticleListItemVO = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  publishTime: Date;
  title: string;
  subtitle: string;
  coverImage?: string;
  /** vertical focus point returned by backend, range 0-1 (0 top, 1 bottom) */
  coverFocusY: number;

  likeCount: number;
  responseNum: number;

  repostCount?: number;
  isCollected?: boolean;
};

export type ArticleVO = {
  id: string;
  title: string;
  subtitle: string | null;
  coverImage: string | null;
  coverFocusY: number;
  content: string;

  topics: TopicInArticleVO[];

  likeCount: number;
  responseNum: number;

  authorId: string;
  authorAvatar: string;
  authorName: string;
  publishTime: string;

  repostCount?: number;
  isCollected?: boolean;
};

export type HomeArticleListRequest = {
  lastCreatedAt: Date | null;
  lastId: string | null;
  size?: number;
};

export type Operation = {
  operationName: "RepostCountQuery" | "CollectionBaseQuery";
  articleId: string;
};

export type OperationList = {
  operationList: Operation[];
};

export type CollectionsConnection = {
  hasCollected: boolean;
};

export type ArticleViewerEdge = {
  id: string;
  collectionsConnection: CollectionsConnection;
};

export type ArticleResult = {
  id: string;
  repostCount?: number;
  viewerEdge?: ArticleViewerEdge;
};
