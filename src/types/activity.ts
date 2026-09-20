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
  clapCount?: number;
  responseCount?: number;
  previewImage?: ImageMetaData;
  title?: string;
  extendedPreviewContent: PreviewContent;
  content?: string;
  creator?: Creator;
  publishAt?: Date;
  responseRootPost: ResponseRootPost;
};

export type PreviewContent = {
  isFullContent: boolean;
  subtitle: string;
};

export type ImageMetaData = {
  url: string;
  coverFocusY: number;
};

export type Creator = {
  id: string;
  avatar: string | null;
  username: string;
};

export type ResponseRootPost = {
  post: Post;
};
