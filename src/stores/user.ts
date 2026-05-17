import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { User } from '../types/User';

export const userAtom = atom<User | null>(null);

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
});

// export const douUpdateUserAtom = atom(
//     null,
//     async (_get, set, newData: Partial<User>) => {
//         const res = await request.patch('/user', newData)
//         set(userAtom, res.data)
//     }
// )