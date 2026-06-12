import { atom } from 'jotai'
import type { UserVO } from '../types/UserVO';

export const userAtom = atom<UserVO | null>(null);

export const isLoginAtom = atom(false);

export const isLoadingAtom = atom(true);
