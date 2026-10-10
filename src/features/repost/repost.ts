import {
  addNote,
  deleteRepost,
  editNote,
  getRepostCountByIds,
  getRepostList,
  getRepostState,
  removeNote,
  repostAnArticle,
} from "@/services/apiRepost";
import type { CursorPageRequest } from "@/types/comment";
import type { DeleteRequest } from "@/types/DeleteRequest";
import type {
  RepostRequest,
  RepostState,
  UserRepostListQuery,
} from "@/types/repost";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

export function getRepostNoteStatus(repostState: RepostState) {
  const hasReposted = repostState.hasReposted;

  return {
    isRepostWithNote: !hasReposted,
    isAddNote: hasReposted && repostState.note === null,
    isEditOrRemoveNote: hasReposted && repostState.note !== null,
  };
}

export function useRepostCount(articleIds: string[]) {
  return useQuery({
    queryKey: ["get-batch-repostCount", articleIds],
    queryFn: () => getRepostCountByIds({ params: { ids: articleIds } }),
    select: (data) => {
      const countMap = new Map<string, number>();
      data.forEach((item) => {
        countMap.set(item.id, item.repostCount);
      });
      return countMap;
    },
  });
}

export function useRepostState(articleId: string) {
  return useQuery({
    queryKey: ["get-repost-state", articleId],
    queryFn: () => getRepostState({ params: { articleId } }),
  });
}

export function useRepostAnArticle(
  articleId: string,
  setBtnState: Dispatch<
    SetStateAction<"idle" | "rotatingP" | "rotatingN" | "reposted">
  >,
) {
  const queryClient = useQueryClient();
  const repostStateKey = ["get-repost-state", articleId];
  const repostCountKey = ["get-batch-repostCount", [articleId]];

  const { mutate: handleRepost } = useMutation({
    mutationKey: ["repost-an-article", articleId],
    mutationFn: async () => {
      const repostRequest = { articleId } as RepostRequest;
      await repostAnArticle({ params: repostRequest });
    },
    onMutate: async () => {
      setBtnState((prev) => (prev === "idle" ? "rotatingP" : prev));

      const previousRepostState =
        queryClient.getQueryData<RepostState>(repostStateKey);
      const previousRepostCount = queryClient.getQueryData<
        Map<string, number> | { id: string; repostCount: number }[]
      >(repostCountKey);
      const nextHasReposted = !(previousRepostState?.hasReposted ?? false);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: repostStateKey }),
        queryClient.cancelQueries({ queryKey: repostCountKey }),
      ]);

      queryClient.setQueryData<RepostState>(repostStateKey, (old) => ({
        userId: old?.userId ?? "",
        articleId,
        hasReposted: nextHasReposted,
        note: old?.note ?? null,
      }));

      queryClient.setQueryData(repostCountKey, (old) => {
        const list = Array.isArray(old) ? old : [];
        const idx = list.findIndex((item) => item.id === articleId);

        const current = list[idx]?.repostCount ?? 0;
        const next = current + (nextHasReposted ? 1 : -1);

        if (idx >= 0) {
          return list.map((item, i) =>
            i === idx ? { ...item, repostCount: next } : item,
          );
        }

        return [...list, { id: articleId, repostCount: next }];
      });

      return { previousRepostState, previousRepostCount };
    },
    onSuccess() {
      toast.success("Article reposted.");
    },
    onError: (error, _variables, context) => {
      if (context?.previousRepostState) {
        queryClient.setQueryData(repostStateKey, context.previousRepostState);
      } else {
        queryClient.removeQueries({ queryKey: repostStateKey });
      }

      if (context?.previousRepostCount) {
        queryClient.setQueryData(repostCountKey, context.previousRepostCount);
        queryClient.setQueriesData(
          { queryKey: ["get-batch-repostCount"] },
          () => context.previousRepostCount,
        );
      } else {
        queryClient.removeQueries({ queryKey: repostCountKey });
      }

      setBtnState("idle");
      toast.error(
        error.message || "An error occurred while reposting the article.",
      );
    },
  });

  return {
    handleRepost,
  };
}

export function useOptimisticDeleteRepost(
  articleId: string,
  setBtnState: Dispatch<
    SetStateAction<"idle" | "rotatingP" | "rotatingN" | "reposted">
  >,
) {
  const repostStateKey = ["get-repost-state", articleId];
  const repostCountKey = ["get-batch-repostCount", [articleId]];
  const queryClient = useQueryClient();
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationKey: ["optimistic-delete-repost", articleId],
    mutationFn: async () => {
      const deleteRequest = { id: articleId } as DeleteRequest;
      await deleteRepost({ params: deleteRequest });
    },
    onMutate: async () => {
      setBtnState((prev) => (prev === "reposted" ? "rotatingN" : prev));

      const previousRepostState =
        queryClient.getQueryData<RepostState>(repostStateKey);
      const previousRepostCount = queryClient.getQueryData<
        Map<string, number> | { id: string; repostCount: number }[]
      >(repostCountKey);
      const nextHasReposted = !(previousRepostState?.hasReposted ?? false);

      await Promise.all([
        queryClient.cancelQueries({ queryKey: repostStateKey }),
        queryClient.cancelQueries({ queryKey: repostCountKey }),
      ]);

      queryClient.setQueryData<RepostState>(repostStateKey, (old) => ({
        ...old,
        userId: old?.userId ?? "",
        articleId,
        hasReposted: nextHasReposted,
        note: null,
      }));

      queryClient.setQueryData(repostCountKey, (old) => {
        const list = Array.isArray(old) ? old : [];
        const idx = list.findIndex((item) => item.id === articleId);

        const current = list[idx]?.repostCount ?? 0;
        const next = current + (nextHasReposted ? 1 : -1);

        if (idx >= 0) {
          return list.map((item, i) =>
            i === idx ? { ...item, repostCount: next } : item,
          );
        }

        return [...list, { id: articleId, repostCount: next }];
      });

      return { previousRepostState, previousRepostCount };
    },
    onSuccess() {
      toast.success("repost deleted.");
    },
    onError: (error, _variables, context) => {
      if (context?.previousRepostState) {
        queryClient.setQueryData(repostStateKey, context.previousRepostState);
      } else {
        queryClient.removeQueries({ queryKey: repostStateKey });
      }

      if (context?.previousRepostCount) {
        queryClient.setQueryData(repostCountKey, context.previousRepostCount);
        queryClient.setQueriesData(
          { queryKey: ["get-batch-repostCount"] },
          () => context.previousRepostCount,
        );
      } else {
        queryClient.removeQueries({ queryKey: repostCountKey });
      }

      setBtnState("reposted");

      toast.error(
        error.message || "An error occurred while deleting the repost.",
      );
    },
  });

  return {
    handleDelete,
    isDeleting,
  };
}

export function useDeleteRepost(articleId: string) {
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-repost", articleId],
    mutationFn: async () => {
      const deleteRequest = { id: articleId } as DeleteRequest;
      await deleteRepost({ params: deleteRequest });
    },
    onSuccess() {
      toast.success("repost deleted.");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while deleting the repost.",
      );
    },
  });

  return {
    handleDelete,
    isDeleting,
  };
}

export function useRepostAnArticleWithNote(
  articleId: string,
  setBtnState?: Dispatch<
    SetStateAction<"idle" | "rotatingP" | "rotatingN" | "reposted">
  >,
) {
  const queryClient = useQueryClient();
  const repostStateKey = ["get-repost-state", articleId];
  const repostCountKey = ["get-batch-repostCount", [articleId]];
  const { mutate: handleRepostWithNote, isPending: isReposting } = useMutation({
    mutationKey: ["repost-an-article-with-note", articleId],
    mutationFn: async ({ note }: { note: string }) => {
      const repostRequest = { articleId, note };
      await repostAnArticle({ params: repostRequest });
    },
    onMutate: async () => {
      setBtnState?.((prev) => (prev === "idle" ? "rotatingP" : prev));
      await Promise.all([
        queryClient.cancelQueries({ queryKey: repostStateKey }),
        queryClient.cancelQueries({ queryKey: repostCountKey }),
      ]);
    },
    onSuccess() {
      setBtnState?.("reposted");
      queryClient.invalidateQueries({ queryKey: repostStateKey });
      queryClient.invalidateQueries({ queryKey: repostCountKey });
      toast.success("Article reposted.");
    },
    onError: (error) => {
      setBtnState?.("idle");
      toast.error(
        error.message || "An error occurred while reposting the article.",
      );
    },
  });

  return {
    handleRepostWithNote,
    isReposting,
  };
}

export function useAddNote(articleId: string) {
  const { mutate: handleAddNote, isPending: isSaving } = useMutation({
    mutationKey: ["add-note-to-repost", articleId],
    mutationFn: async ({ note }: { note: string }) => {
      const addNoteRequest = { articleId, note };
      await addNote({ params: addNoteRequest });
    },
    onSuccess() {
      toast.success("Note added to repost.");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while adding note to repost.",
      );
    },
  });

  return {
    handleAddNote,
    isSaving,
  };
}

export function useEditNote(articleId: string) {
  const { mutate: handleEditNote, isPending: isEditing } = useMutation({
    mutationKey: ["edit-note-for-repost", articleId],
    mutationFn: async ({ note }: { note: string }) => {
      const editNoteRequest = { articleId, note };
      await editNote({ params: editNoteRequest });
    },
    onSuccess() {
      toast.success("Note updated for repost.");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while updating note for repost.",
      );
    },
  });

  return {
    handleEditNote,
    isEditing,
  };
}

export function useRemoveNote(articleId: string) {
  const { mutate: handleRemoveNote, isPending: isRemoving } = useMutation({
    mutationKey: ["remove-note-from-repost", articleId],
    mutationFn: async () => {
      const removeNoteRequest = { articleId };
      await removeNote({ params: removeNoteRequest });
    },
    onSuccess() {
      toast.success("Note removed from repost.");
    },
    onError: (error) => {
      toast.error(
        error.message || "An error occurred while deleting note from repost.",
      );
    },
  });

  return {
    handleRemoveNote,
    isRemoving,
  };
}

export function useGetInfiniteRepostList(userId: string) {
  return useInfiniteQuery({
    queryKey: ["get-user-repost-list", userId],
    queryFn: async ({ pageParam }: { pageParam: CursorPageRequest }) => {
      return await getRepostList({
        params: {
          ...pageParam,
          userId,
        } as UserRepostListQuery,
      });
    },
    initialPageParam: {
      lastCreatedAt: null,
      lastId: null,
    } as CursorPageRequest,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore
        ? {
            lastCreatedAt: lastPage.nextCursorCreatedAt,
            lastId: lastPage.nextCursorId,
          }
        : undefined;
    },
  });
}
