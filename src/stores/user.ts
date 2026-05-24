import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { UserVO } from '../types/UserVO';

export const userAtom = atom<UserVO | null>(null);

export const tokenAtom = atomWithStorage<string | null>('token', null)

export const isLoginAtom = atom((get) => {
    return (!!get(userAtom) && !!get(tokenAtom));
});

export const doLoginAtom = atom(null, (_get, set, token: string) => {
    set(tokenAtom, token);
});

export const doLogoutAtom = atom(null, (_get, set) => {
    set(tokenAtom, null);
    set(userAtom, null);
    location.reload();
});