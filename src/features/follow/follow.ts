import { getFollowBatchStatus, getFollowUserList, updateFollow } from "@/services/apiFollow";
import type { FollowAction, FollowListType } from "@/types/follow";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import i18n from "@/i18n";

const FOLLOW_LIST_PAGE_SIZE = 12;
const FOLLOW_STATUS_BATCH_SIZE = 100;

type FollowListCursor = {
    lastCreatedAt: string | null;
    lastId: string | null;
}

export function useInfiniteFollowUserList(userId: string, type: FollowListType) {
    return useInfiniteQuery({
        queryKey: ['follow-user-list', userId, type],
        queryFn: ({ pageParam }: { pageParam: FollowListCursor }) => getFollowUserList(type, {
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
            if (!lastPage.hasMore || !lastPage.nextCursorCreatedAt || !lastPage.nextCursorId) {
                return undefined;
            }

            return {
                lastCreatedAt: lastPage.nextCursorCreatedAt,
                lastId: lastPage.nextCursorId,
            };
        },
    });
}

export function useFollowStatuses(userIds: string[], enabled = true) {
    const queryClient = useQueryClient();
    const uniqueUserIds = [...new Set(userIds)].sort();
    const queryKey = ['follow-status-batch', uniqueUserIds] as const;
    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const batches = Array.from(
                { length: Math.ceil(uniqueUserIds.length / FOLLOW_STATUS_BATCH_SIZE) },
                (_, index) => uniqueUserIds.slice(
                    index * FOLLOW_STATUS_BATCH_SIZE,
                    (index + 1) * FOLLOW_STATUS_BATCH_SIZE,
                ),
            );
            const results = await Promise.all(
                batches.map(targetUserIds => getFollowBatchStatus({ targetUserIds })),
            );

            return Object.assign({}, ...results.map(result => result.followingMap)) as Record<string, boolean>;
        },
        enabled: enabled && uniqueUserIds.length > 0,
    });

    return {
        ...query,
        retry: () => queryClient.invalidateQueries({ queryKey }),
    };
}

export function useFollowStatus(userId: string, enabled: boolean) {
    const queryClient = useQueryClient();
    const queryKey = ['follow-status', userId];
    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await getFollowBatchStatus({ targetUserIds: [userId] });
            return result.followingMap[userId] ?? false;
        },
        enabled,
    });

    return {
        ...query,
        retry: () => queryClient.invalidateQueries({ queryKey }),
    };
}

export function useFollowAction(userId: string) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (action: FollowAction) => updateFollow({ targetUserId: userId, action }),
        onSuccess: (_, action) => {
            queryClient.setQueryData(['follow-status', userId], action === 1);
            queryClient.setQueriesData<Record<string, boolean>>(
                { queryKey: ['follow-status-batch'] },
                old => old ? { ...old, [userId]: action === 1 } : old,
            );
            queryClient.invalidateQueries({ queryKey: ['get-profile', userId] });
            toast.success(i18n.t(action === 1 ? 'profile.toast.followSuccess' : 'profile.toast.unfollowSuccess'));
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return {
        toggleFollow: mutation.mutate,
        isFollowPending: mutation.isPending,
    };
}
