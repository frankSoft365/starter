import {
  articleSetPinnedByCreatorAt,
  deleteArticle,
  getArticleById,
  getPrivateArticleDetailForEditById,
  updateArticle,
} from "@/services/apiArticle";
import { getLikeBatchStatus, likeAction } from "@/services/apiLike";
import type { BlockNoteEditor } from "@blocknote/core";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type {
  ArticleDetail,
  ArticlePublishPreview,
  ArticlePublishRequest,
  ArticleSetPinnedByCreatorAtRequest,
  ArticlePreview,
  ArticleUpdateRequest,
} from "../../types/article";
import type { CursorPage } from "@/types/comment";
import { useSetAtom } from "jotai";
import { editorPublishSignalAtom } from "../../atoms/editor";
import { publishArticle } from "../../services/apiArticle";
import { getTitle } from "@/utils/editorHelper";
import { useNavigate } from "@tanstack/react-router";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import type { DeleteRequest } from "@/types/DeleteRequest";
import type { ArticleSubmissionForm } from "@/schemas/article";
import { useState } from "react";

export function useArticlePublish(
  articlePreview: ArticlePublishPreview | null,
) {
  const navigate = useNavigate();
  const setEditorPublishSignal = useSetAtom(editorPublishSignalAtom);

  const { mutate: handlePublish, isPending: isPublishing } = useMutation({
    mutationKey: ["publish-article"],
    mutationFn: async ({ value }: { value: ArticleSubmissionForm }) => {
      if (!articlePreview) {
        throw new Error("No article submission content.");
      }
      const content = articlePreview.content;
      const coverImage = value.coverImage;
      const coverFocusY = value.coverFocusY;
      const title = value.title;
      const subtitle = value.subtitle;
      const topics = value.topics;

      const publishRequest: ArticlePublishRequest = {
        title,
        ...(subtitle && { subtitle }),
        content,
        ...(coverImage && { coverImage }),
        ...(coverFocusY && { coverFocusY }),
        topics,
        status: "published",
        // publishAt: null
      };
      const articleId = await publishArticle(publishRequest);
      return articleId;
    },
    onSuccess(articleId) {
      toast.success("Article published successfully.");
      setEditorPublishSignal((pre) => pre + 1);
      navigate({ to: articleRoute.to, params: { articleId: articleId } });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while publishing the article.",
      );
    },
  });

  return {
    handlePublish,
    isPublishing,
  };
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-article"],
    mutationFn: async ({ articleDeletedId }: { articleDeletedId: string }) => {
      const deleteRequest = { id: articleDeletedId } as DeleteRequest;
      await deleteArticle(deleteRequest);
    },
    onSuccess() {
      toast.success("Article deleted successfully.");
      // 针对在主页删除文章的刷新
      queryClient.invalidateQueries({
        queryKey: ["get-public-home-article-list"],
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while publishing the article.",
      );
    },
  });

  return {
    handleDelete,
    isDeleting,
  };
}

export function useUpdateArticle() {
  const { mutate: handleUpdate, isPending: isUpdating } = useMutation({
    mutationKey: ["update-article"],
    mutationFn: async ({ request }: { request: ArticleUpdateRequest }) => {
      if (!request) {
        throw new Error("No article update content.");
      }
      await updateArticle(request);
    },
    onSuccess() {
      toast.success("Article updated successfully.");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while publishing the article.",
      );
    },
  });

  return {
    handleUpdate,
    isUpdating,
  };
}

export function useCurrentArticle(
  articleId: string,
  editor: BlockNoteEditor,
  detail = true,
) {
  return useQuery({
    queryKey: ["get-article", articleId],
    queryFn: async () => {
      const article = await getArticleById(articleId);
      const content = JSON.parse(article.content);
      let title = "";
      if (detail) {
        title = getTitle(editor, content);
        const [_headingBlock, ...bodyBlock] = content;
        const body = bodyBlock;
        editor.replaceBlocks(editor.document, body);
      } else {
        editor.replaceBlocks(editor.document, content);
      }
      return {
        title,
        article,
      };
    },
  });
}

export function usePrivateArticleDetailForEdit(
  articleId: string,
  editor: BlockNoteEditor,
  detail = true,
) {
  return useQuery({
    queryKey: ["get-article", articleId],
    queryFn: async () => {
      const article = await getPrivateArticleDetailForEditById(articleId);
      const content = JSON.parse(article.content);
      let title = "";
      if (detail) {
        title = getTitle(editor, content);
        const [_headingBlock, ...bodyBlock] = content;
        const body = bodyBlock;
        editor.replaceBlocks(editor.document, body);
      } else {
        editor.replaceBlocks(editor.document, content);
      }
      return {
        title,
        article,
      };
    },
    retry: false,
  });
}

export function useChangeCoverImage(coverImages: string[]) {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const [newImage, setNewImage] = useState(coverImages[0]);

  return {
    newImage,
    setNewImage,
    isAdjustModalOpen,
    setIsAdjustModalOpen,
  };
}

export function useLikeStatus(articleId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["get-like-status", "article", articleId],
    queryFn: async () => {
      const res = await getLikeBatchStatus({
        targetType: 1,
        targetIds: [articleId],
      });
      return res.likedMap[articleId] ?? false;
    },
    enabled,
  });
}

export function useLikeArticle(articleId: string) {
  const queryClient = useQueryClient();
  const likeStatusKey = ["get-like-status", "article", articleId];
  const articleKey = ["get-article", articleId];

  const { mutate: toggleLike, isPending: isLiking } = useMutation({
    mutationFn: async ({ action }: { action: 1 | 2 }) => {
      await likeAction({ targetType: 1, targetId: articleId, action });
    },
    onMutate: async ({ action }) => {
      const newLiked = action === 1;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: likeStatusKey }),
        queryClient.cancelQueries({ queryKey: articleKey }),
      ]);

      const previousLiked = queryClient.getQueryData<boolean>(likeStatusKey);
      const previousArticle = queryClient.getQueryData<{
        title: string;
        article: ArticleDetail;
      }>(articleKey);
      const delta = newLiked ? 1 : -1;
      queryClient.setQueryData<boolean>(likeStatusKey, newLiked);

      queryClient.setQueryData<
        { title: string; article: ArticleDetail } | undefined
      >(articleKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          article: {
            ...old.article,
            clapCount: old.article.clapCount + delta,
          },
        };
      });

      return { previousLiked, previousArticle };
    },
    onError: (error, _vars, context) => {
      if (context) {
        if (context.previousLiked === undefined) {
          queryClient.removeQueries({ queryKey: likeStatusKey, exact: true });
        } else {
          queryClient.setQueryData(likeStatusKey, context.previousLiked);
        }
        if (context.previousArticle === undefined) {
          queryClient.removeQueries({ queryKey: articleKey, exact: true });
        } else {
          queryClient.setQueryData(articleKey, context.previousArticle);
        }
      }
      toast.error(error.message);
    },
  });

  return { toggleLike, isLiking };
}

export function useArticleSetPinnedByCreatorAt(authorId: string) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: handlePinArticle, isPending: isPinning } = useMutation({
    mutationKey: ["article-set-pinned-by-creator-at"],
    mutationFn: async ({
      isPinned,
      articleId,
    }: {
      isPinned: boolean;
      articleId: string;
    }) => {
      const articleSetPinnedByCreatorAtRequest: ArticleSetPinnedByCreatorAtRequest =
        {
          isPinned,
          articleId,
        };
      await articleSetPinnedByCreatorAt({
        params: articleSetPinnedByCreatorAtRequest,
      });
      return isPinned;
    },
    onSuccess(isPinned, { articleId }) {
      queryClient.setQueryData<InfiniteData<CursorPage<ArticlePreview>>>(
        ["get-profile-my-article-list", authorId],
        (old) => {
          if (!old) {
            return old;
          }

          const pinnedByCreatorAt = isPinned ? Date.now().toString() : "0";
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((article) =>
                article.id === articleId
                  ? { ...article, pinnedByCreatorAt }
                  : article,
              ),
            })),
          };
        },
      );
      toast.success(
        isPinned ? t("article.toast.pinned") : t("article.toast.unpinned"),
      );
    },
    onError: (error) => {
      toast.error(error.message || t("article.toast.pinError"));
    },
  });

  return {
    handlePinArticle,
    isPinning,
  };
}
