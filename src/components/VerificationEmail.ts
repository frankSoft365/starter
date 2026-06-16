import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, type Dispatch } from "react";
import { getVerificationCode, userRegister, verifyVerificationCode, type SendCodeRequest, type UserRegisterRequest, type VerifyCodeRequest } from "../utils/userRegisterHelper";
import { toast } from "sonner";
import type { UseNavigateResult } from "@tanstack/react-router";
import { Route as LoginRoute } from "../routes/login";
import type { RegisterStep } from "./RegisterForm";

export function useVerificationEmail(
    setTimer: React.Dispatch<React.SetStateAction<number>>,
    setCanResend: React.Dispatch<React.SetStateAction<boolean>>,
    setStep: Dispatch<React.SetStateAction<RegisterStep>>,
    navigate: UseNavigateResult<string>
) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const { mutate: sendVerificationCode, isPending: isSending } = useMutation({
        mutationFn: async () => {
            console.log('发送验证码到', email);
            const request = {
                email
            } as SendCodeRequest;
            await getVerificationCode(request);
        },
        mutationKey: ['send-verification-code'],
        onSuccess: () => {
            setTimer(60);
            setCanResend(false);
            setStep('VERIFY');
            toast.success('Verification code has been sent');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });


    const { mutate: verifyCode, isPending: isVerifying } = useMutation({
        mutationFn: async () => {
            console.log('验证', email, code);
            const request = {
                email: email,
                verifyCode: code
            } as VerifyCodeRequest;
            const token = await verifyVerificationCode(request);
            return token;
        },
        mutationKey: ['verify-verification-code'],
        onSuccess: (token) => {
            setToken(token);
            setStep('USERINFO');
            toast.success('Email verification successful');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });


    const { mutate: registerUser, isPending: isRegister } = useMutation({
        mutationFn: async () => {
            console.log('注册', { email, username, password });
            const request = {
                token,
                username,
                password
            } as UserRegisterRequest;
            const userId = await userRegister(request);
            return userId
        },
        mutationKey: ['user-register'],
        onSuccess: (userId) => {
            console.log('user register id : ', userId);
            toast.success('Registration successful');
            navigate({ to: LoginRoute.to });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return (
        {
            email,
            setEmail,
            code,
            setCode,
            username,
            setUsername,
            password,
            setPassword,
            sendVerificationCode,
            isSending,
            verifyCode,
            isVerifying,
            registerUser,
            isRegister
        }
    );
}

export function useTimer() {
    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);

    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    return ({
        timer,
        setTimer,
        canResend,
        setCanResend
    })
}