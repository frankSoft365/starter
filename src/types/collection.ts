export interface ListCoverItemVO {
  articleId: string;
  coverImage: string | null;
  isDelete: number; // 0 = normal, 1 = deleted
}

export interface CollectionListVO {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  articleCount: number;
  isPublic: number; // 0 = private, 1 = public
  isDefault: number; // 0 = custom, 1 = default
  coverImages: ListCoverItemVO[];
}

export interface CollectionListDetailVO {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  articleCount: number;
  isPublic: number; // 0 = private, 1 = public
  isDefault: number; // 0 = custom, 1 = default
}

export interface ArticleCollectStatusVO {
  listId: string;
  listName: string;
  isDefault: number; // 0 = custom, 1 = default
  isPublic: number; // 0 = private, 1 = public
  isCollected: boolean;
}
