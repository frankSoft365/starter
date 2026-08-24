import { unreadCountAtom } from "@/atoms/notification";
import { getUnreadCount } from "@/services/apiNotification";
import { useQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export function useUnreadCountQuery() {
    const setUnreadCount = useSetAtom(unreadCountAtom);

    const query = useQuery({
        queryKey: ['unreadCount'],
        queryFn: getUnreadCount,
        staleTime: Infinity,
    });

    useEffect(() => {
        if (query.data) {
            setUnreadCount(query.data);
        }
    }, [query.data, setUnreadCount]);

    return query;
}