import { atom } from "jotai";

export type DeleteArticleModalOptions = {
  articleDeletedId: string;
};

// 存储当前被选中的操作信息，null 表示没有打开
export const deleteArticleModalAtom = atom<DeleteArticleModalOptions | null>(
  null,
);
