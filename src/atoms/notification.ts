import type { UnreadCountVO } from '@/types/notification';
import { atom } from 'jotai'

export const unreadCountAtom = atom<UnreadCountVO | null>(null);

export const totalUnreadCountAtom = atom(
    (get) => {
        const unreadCount = get(unreadCountAtom);
        const replyCount = Number(unreadCount?.replyCount) ?? 0;
        const likeCount = Number(unreadCount?.likeCount) ?? 0;
        const followCount = Number(unreadCount?.followCount) ?? 0;
        return (replyCount + likeCount + followCount);
    }
); 