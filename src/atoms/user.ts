import type { UserVO } from '@/types/user';
import { atom } from 'jotai'

export const userAtom = atom<UserVO | null>(null);

export const isLoginAtom = atom(false);

export const isLoadingAtom = atom(true);
