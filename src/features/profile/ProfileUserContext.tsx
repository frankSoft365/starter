import React from 'react'
import type { UserVO } from '@/types/user'

export const ProfileUserContext = React.createContext<UserVO | null>(null);

export function ProfileUserProvider({ user, children }: { user?: UserVO | null, children: React.ReactNode }) {
    return (
        <ProfileUserContext.Provider value={user ?? null}>
            {children}
        </ProfileUserContext.Provider>
    )
}

export function useProfileUser() {
    return React.useContext(ProfileUserContext);
}
