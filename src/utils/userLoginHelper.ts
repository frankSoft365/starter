import { toast } from "sonner";
import request from "./request";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { isLoginAtom } from "../stores/user";
import { useNavigate } from "@tanstack/react-router";
import { Route as HomeRoute } from "../routes/_app/index";
import { useState } from "react";

type UserLoginRequest = {
    email: string;
    password: string;
}

type UserLoginVO = {
    id: string;
    username: string;
}

export async function login(params: UserLoginRequest) {
    return request.post<any, UserLoginVO>('/user/login', params);
}

export async function logout() {
    return request.post<any, void>('/user/logout');
}

export function useUserLogin() {
    const setIsLogin = useSetAtom(isLoginAtom);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { isPending: isLogining, mutate: userLogin } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success('Login successful');
            setIsLogin(true);
            navigate({ to: HomeRoute.to });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
    return ({
        userLogin,
        isLogining,
        email,
        setEmail,
        password,
        setPassword
    });
}

export function useUserLogout() {
    const { isPending: isLogouting, mutate: userLogout } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success('Logout successful');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })
    return ({
        userLogout,
        isLogouting
    });
}