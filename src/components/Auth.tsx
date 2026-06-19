import type React from "react";
import { useEffect } from "react";
import { getCurrentUser } from "../services/apiUserProfile";
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
                const userInfo = await getCurrentUser();
                setUserInfo(userInfo);
                setIsLogin(true);
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            } finally {
                setIsLoading(false);
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