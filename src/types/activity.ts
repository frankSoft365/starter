import type { Creator, ImageMetaData, PreviewContent } from "./article";

export type ActivityType = "POST_CLAPPED" | "RESPONSE_CREATED";

export type UserActivitiesQuery = {
  lastCreatedAt: Date | null;
  lastId: string | null;
  size?: number;

  userId: string;
  activityTypes: ActivityType[];
};

export type UserActivity = {
  activityId: string;
  activityType: ActivityType;
  occurredAt: Date;
  post: Post;
  responsePost: Post | null;
};

export type Post = {
  id: string;
  clapCount: number | null;
  responseCount: number | null;
  previewImage: ImageMetaData | null;
  title: string | null;
  extendedPreviewContent: PreviewContent;
  content: string | null;
  creator: Creator;
  publishAt: Date;
  responseRootPost: ResponseRootPost;

  repostCount?: number;
  isCollected?: boolean;
};

export type ResponseRootPost = {
  post: Post;
};
