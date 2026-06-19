import type React from "react";
import { useEffect } from "react";
import { getUserProfile } from "../utils/userProfileHelper";
import { useSetAtom } from "jotai";
import { isLoadingAtom, isLoginAtom, userAtom } from "../stores/user";
import { toast } from "sonner";

export default function Auth({ children }: { children: React.ReactNode }) {
    const setUserInfo = useSetAtom(userAtom);
    const setIsLogin = useSetAtom(isLoginAtom);
    const setIsLoading = useSetAtom(isLoadingAtom);
    useEffect(() => {
        async function fetchUserInfo() {
            setIsLoading(true);
            try {
                const userInfo = await getUserProfile();
                setUserInfo(userInfo);
                setIsLogin(true);
                setIsLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        }
        fetchUserInfo();
    }, []);
    return (
        <>
            {children}
        </>
    );
}