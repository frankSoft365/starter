import {
  clearAllReadingHistory,
  deleteOneReadingHistory,
  getReadingHistoryList,
  saveReadingHistory,
} from "@/services/apiReadingHistory";
import type { DeleteRequest } from "@/types/DeleteRequest";
import type {
  ReadingHistoryQuery,
  RecordReadingHistoryRequest,
} from "@/types/readingHistory";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export function useSaveReadingHistory(articleId: string) {
  useEffect(() => {
    function saveHistory() {
      const params = { articleId } as RecordReadingHistoryRequest;
      saveReadingHistory({ params });
    }
    saveHistory();
  }, [articleId]);
}

const QUERY_KEY = "get-reading-history-list";

export function useGetInfiniteReadingHistoryList() {
  const queryClient = useQueryClient();
  function retry() {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY],
    });
  }
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEY],
    queryFn: async ({ pageParam }: { pageParam: ReadingHistoryQuery }) => {
      return await getReadingHistoryList({ params: pageParam });
    },
    initialPageParam: {
      lastCreatedAt: null,
      lastId: null,
    } as ReadingHistoryQuery,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore
        ? {
            lastCreatedAt: lastPage.nextCursorCreatedAt,
            lastId: lastPage.nextCursorId,
          }
        : undefined;
    },
  });
  return {
    query,
    retry,
  };
}

export function useClearReadingHistory() {
  const queryClient = useQueryClient();
  const { mutate: handleClear, isPending: isClearing } = useMutation({
    mutationKey: ["clear-reading-history"],
    mutationFn: clearAllReadingHistory,
    onSuccess() {
      toast.success("Reading history successfully cleared.");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(
        error.message ||
          "An error occurred while clearing the reading history.",
      );
    },
  });

  return {
    handleClear,
    isClearing,
  };
}

export function useDeleteHistoryItem() {
  const queryClient = useQueryClient();
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-reading-history-item"],
    mutationFn: async ({ articleId }: { articleId: string }) => {
      const deleteRequest = { id: articleId } as DeleteRequest;
      await deleteOneReadingHistory(deleteRequest);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
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
