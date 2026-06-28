import type { ChangePasswordForm } from "@/schemas/account";
import type { LoginForm } from "@/schemas/auth";

export type UserVO = {
    id: string;
    username: string;
    email: string;
    role: string;
    image: string | null;
}

export type UserUpdateRequest = {
    username?: string;
    image?: string;
}

export type ChangePasswordRequest = ChangePasswordForm;

export type UserLoginRequest = LoginForm;

export type UserRegisterRequest = {
    token: string;
    username: string;
    password: string;
}

export type SendCodeRequest = {
    email: string;
}

export type VerifyCodeRequest = {
    email: string;
    verifyCode: string;
}