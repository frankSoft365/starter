import {
  getBatchUserViewerEdges,
  getFollowUserList,
  getUserViewerEdge,
  updateFollow,
} from "@/services/apiFollow";
import type { FollowAction, FollowListType } from "@/types/follow";
import {
  useInfiniteQuery,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import i18n from "@/i18n";
import type {
  Operation,
  OperationList,
  OperationResult,
  User,
  UserViewerEdge,
} from "@/types/article";
import type { UserVO } from "@/types/user";

const FOLLOW_LIST_PAGE_SIZE = 12;

type FollowListCursor = {
  lastCreatedAt: string | null;
  lastId: string | null;
};

export function useInfiniteFollowUserList(
  userId: string,
  type: FollowListType,
) {
  return useInfiniteQuery({
    queryKey: ["follow-user-list", userId, type],
    queryFn: ({ pageParam }: { pageParam: FollowListCursor }) =>
      getFollowUserList(type, {
        userId,
        lastCreatedAt: pageParam.lastCreatedAt,
        lastId: pageParam.lastId,
        size: FOLLOW_LIST_PAGE_SIZE,
      }),
    initialPageParam: {
      lastCreatedAt: null,
      lastId: null,
    } as FollowListCursor,
    getNextPageParam: (lastPage) => {
      if (
        !lastPage.hasMore ||
        !lastPage.nextCursorCreatedAt ||
        !lastPage.nextCursorId
      ) {
        return undefined;
      }

      return {
        lastCreatedAt: lastPage.nextCursorCreatedAt,
        lastId: lastPage.nextCursorId,
      };
    },
  });
}

export function useFollowAction(targetUserId: string, currentUserId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (action: FollowAction) =>
      updateFollow({ targetUserId, action }),
    onMutate: async (action: FollowAction) => {
      const userBatchViewerEdgeFilter = {
        predicate(query: { queryKey: QueryKey }) {
          const [key, targetUserIds] = query.queryKey;
          return (
            key === "user-batch-viewer-edge" &&
            Array.isArray(targetUserIds) &&
            targetUserIds.includes(targetUserId)
          );
        },
      };
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: ["user-viewer-edge", targetUserId],
        }),
        queryClient.cancelQueries(userBatchViewerEdgeFilter),
      ]);
      const previousUserViewerEdgeData =
        queryClient.getQueryData<OperationResult>([
          "user-viewer-edge",
          targetUserId,
        ]);
      const previousUserViewerEdgesData = queryClient.getQueriesData<
        OperationResult[]
      >(userBatchViewerEdgeFilter);
      const previousProfileData = queryClient.getQueryData<UserVO>([
        "get-profile",
        targetUserId,
      ]);
      queryClient.setQueryData<OperationResult>(
        ["user-viewer-edge", targetUserId],
        (old) => {
          if (!old || !old.user) {
            return;
          }
          const newViewerEdge: UserViewerEdge = {
            ...old.user.viewerEdge,
            isFollowing: action === 1 ? true : false,
          };
          const newUser: User = {
            ...old.user,
            viewerEdge: newViewerEdge,
          };
          return {
            ...old,
            user: newUser,
          };
        },
      );
      queryClient.setQueriesData<OperationResult[]>(
        userBatchViewerEdgeFilter,
        (old) =>
          old?.map((result) => {
            if (!result.user || result.user.id !== targetUserId) {
              return result;
            }
            return {
              ...result,
              user: {
                ...result.user,
                viewerEdge: {
                  ...result.user.viewerEdge,
                  isFollowing: action === 1,
                },
              },
            };
          }),
      );
      queryClient.setQueryData<UserVO>(["get-profile", targetUserId], (old) => {
        if (!old) {
          return old;
        }
        const newUserVO: UserVO = {
          ...old,
          followerCount: old.followerCount + (action === 1 ? 1 : -1),
        };
        return newUserVO;
      });
      return {
        previousUserViewerEdgeData,
        previousUserViewerEdgesData,
        previousProfileData,
      };
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({
        predicate(query) {
          const key = query.queryKey;
          const targetUserIds = key[1];
          return (
            key[0] === "user-batch-viewer-edge" &&
            Array.isArray(targetUserIds) &&
            targetUserIds.includes(targetUserId)
          );
        },
      });

      queryClient.invalidateQueries({
        queryKey: ["follow-user-list"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get-profile", targetUserId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-profile", currentUserId],
      });

      toast.success(
        i18n.t(
          action === 1
            ? "profile.toast.followSuccess"
            : "profile.toast.unfollowSuccess",
        ),
      );
    },
    onError: (error, _action, context) => {
      if (context?.previousUserViewerEdgeData) {
        queryClient.setQueryData(
          ["user-viewer-edge", targetUserId],
          context.previousUserViewerEdgeData,
        );
      }
      context?.previousUserViewerEdgesData.forEach(
        ([queryKey, previousData]) => {
          if (previousData) {
            queryClient.setQueryData(queryKey, previousData);
          }
        },
      );
      if (context?.previousProfileData) {
        queryClient.setQueryData(
          ["get-profile", targetUserId],
          context.previousProfileData,
        );
      }

      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-viewer-edge", targetUserId],
      });
    },
  });

  return {
    toggleFollow: mutation.mutate,
    isFollowPending: mutation.isPending,
  };
}

export function useUserViewerEdge(targetUserId: string, enabled: boolean) {
  const { data: userViewerEdge, status: userViewerEdgeStatus } = useQuery({
    queryKey: ["user-viewer-edge", targetUserId],
    queryFn: async () => {
      const operation: Operation = {
        operationName: "UserViewerEdge",
        id: targetUserId,
      };
      return await getUserViewerEdge({ params: operation });
    },
    enabled,
  });

  return {
    userViewerEdge,
    userViewerEdgeStatus,
  };
}

function selectResultsMap(results: OperationResult[]) {
  const resMap = new Map<string, boolean>();

  // 仅follow
  for (const result of results) {
    if (!result.user) {
      continue;
    }
    const user = result.user;
    resMap.set(user.id, user.viewerEdge.isFollowing);
  }

  return resMap;
}

export function useBatchUserViewerEdges(targetUserIds: string[][]) {
  const seenTargetUserIds = new Set<string>();
  const uniqueTargetUserIdBatches = targetUserIds
    .map((batch) =>
      batch.filter((targetUserId) => {
        if (!targetUserId || seenTargetUserIds.has(targetUserId)) {
          return false;
        }
        seenTargetUserIds.add(targetUserId);
        return true;
      }),
    )
    .filter((batch) => batch.length > 0);

  const userViewerEdgesQueries = useQueries({
    queries: uniqueTargetUserIdBatches.map((userIds) => {
      const operationList: OperationList["operationList"] = userIds.flatMap(
        (userId) => [
          {
            operationName: "UserViewerEdge",
            id: userId,
          },
        ],
      );

      return {
        queryKey: ["user-batch-viewer-edge", userIds],
        queryFn: () => getBatchUserViewerEdges({ params: { operationList } }),
        select: selectResultsMap,
        enabled: operationList.length > 0,
      };
    }),
  });

  const userViewerEdgeById = new Map<string, boolean>();
  const userViewerEdgeStatusById = new Map<
    string,
    "error" | "success" | "pending"
  >();

  userViewerEdgesQueries.forEach((query, index) => {
    query.data?.forEach((result, targetUserId) => {
      userViewerEdgeById.set(targetUserId, result);
    });

    const queryStatus = query.isPending
      ? "pending"
      : query.isError
        ? "error"
        : "success";
    uniqueTargetUserIdBatches[index].forEach((targetUserId) => {
      userViewerEdgeStatusById.set(targetUserId, queryStatus);
    });
  });

  return { userViewerEdgeById, userViewerEdgeStatusById };
}
