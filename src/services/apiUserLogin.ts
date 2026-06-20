import { toast } from "sonner";
import request from "../utils/request";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { isLoadingAtom, isLoginAtom, userAtom } from "../atoms/user";
import { useNavigate } from "@tanstack/react-router";
import { Route as HomeRoute } from "../routes/_app/index";
import { useState } from "react";
import type { UserVO } from "../types/UserVO";

type UserLoginRequest = {
    email: string;
    password: string;
}

export async function login(params: UserLoginRequest) {
    return request.post<any, UserVO>('/user/login', params);
}

export async function logout() {
    return request.post<any, void>('/user/logout');
}

export function useUserLogin() {
    const setUserInfo = useSetAtom(userAtom);
    const setIsLogin = useSetAtom(isLoginAtom);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { isPending: isLoggingIn, mutate: userLogin } = useMutation({
        mutationFn: login,
        onSuccess: async (userInfo) => {
            toast.success('Login successful');
            setIsLogin(true);
            setUserInfo(userInfo);
            navigate({ to: HomeRoute.to });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
    return ({
        userLogin,
        isLoggingIn,
        email,
        setEmail,
        password,
        setPassword
    });
}

export function useUserLogout() {
    const setIsLoading = useSetAtom(isLoadingAtom);
    const setUser = useSetAtom(userAtom);
    const setIsLogin = useSetAtom(isLoginAtom);

    const { isPending: isLoggingOut, mutate: userLogout } = useMutation({
        mutationFn: async () => {
            setIsLoading(true);
            await logout();
        },
        onSuccess: () => {
            setUser(null);
            setIsLogin(false);
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            setIsLoading(false);
        }
    })
    return ({
        userLogout,
        isLoggingOut
    });
}