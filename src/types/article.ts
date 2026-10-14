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

export type Creator = {
  id: string;
  avatar: string | null;
  username: string;
};

export type PreviewContent =
  | {
      isFullContent: true;
      subtitle: null;
    }
  | {
      isFullContent: false;
      subtitle: string;
    };

export type ImageMetaData = {
  url: string | null;
  coverFocusY: number;
};

export type ArticlePreview = {
  id: string;
  creator: Creator;
  title: string;
  extendedPreviewContent: PreviewContent;
  previewImage: ImageMetaData;
  publishAt: Date;

  clapCount: number;
  responseCount: number;
};

export type ArticleListItemType = ArticlePreview & {
  repostCount?: number;
  isCollected?: boolean;
};

export type ArticleDetail = ArticlePreview & {
  content: string;
  topics: TopicInArticleVO[];
};

export type ArticleDetailType = ArticleDetail & {
  isCollected: boolean;
};
