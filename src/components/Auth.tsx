import type React from "react";
import { useEffect } from "react";
import { getUserProfile } from "../utils/userProfileHelper";
import { useSetAtom } from "jotai";
import { isLoadingAtom, isLoginAtom, userAtom } from "../stores/user";

export default function Auth({ children }: { children: React.ReactNode }) {
    const setUserInfo = useSetAtom(userAtom);
    const setIsLogin = useSetAtom(isLoginAtom);
    const setIsLoading = useSetAtom(isLoadingAtom);
    useEffect(() => {
        async function fetchUserInfo() {
            setIsLoading(true);
            const userInfo = await getUserProfile();
            if (userInfo) {
                setUserInfo(userInfo);
                setIsLogin(true);
            } else {
                console.log('userInfo is undefined');

            }
            setIsLoading(false);
        }
        fetchUserInfo();
    }, []);
    return (
        <>
            {children}
        </>
    );
}