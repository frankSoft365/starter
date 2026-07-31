import type { UnreadCountVO } from '@/types/notification';
import { atom } from 'jotai'

export const unreadCountAtom = atom<UnreadCountVO>({
    replyCount: '0',
    likeCount: '0',
    followCount: '0'
} as UnreadCountVO);

export const totalUnreadCountAtom = atom(
    (get) => {
        const unreadCount = get(unreadCountAtom);
        const replyCount = Number(unreadCount?.replyCount) ?? 0;
        const likeCount = Number(unreadCount?.likeCount) ?? 0;
        const followCount = Number(unreadCount?.followCount) ?? 0;
        return (replyCount + likeCount + followCount);
    }
); 