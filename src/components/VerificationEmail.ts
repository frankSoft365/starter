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
            const baseResult = await getVerificationCode(request);
            if (baseResult.code !== 0) {
                throw new Error('failed send verification code')
            }
        },
        mutationKey: ['send-verification-code'],
        onSuccess: () => {
            setTimer(60);
            setCanResend(false);
            setStep('VERIFY');
            toast.success('Verification code has been sent');
        },
        onError: (error) => {
            console.log('error : ', error.message);
        }
    });


    const { mutate: verifyCode, isPending: isVerifying } = useMutation({
        mutationFn: async () => {
            console.log('验证', email, code);
            const request = {
                email: email,
                verifyCode: code
            } as VerifyCodeRequest;
            const baseResult = await verifyVerificationCode(request);
            if (baseResult.code !== 0) {
                throw new Error('failed verify')
            }

            return baseResult;
        },
        mutationKey: ['verify-verification-code'],
        onSuccess: (data) => {
            const token = data.data;
            setToken(token);
            setStep('USERINFO');
            toast.success('Email verification successful');
        },
        onError: (error) => {
            console.log('error : ', error.message);
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
            const baseResult = await userRegister(request);
            if (baseResult.code !== 0) {
                throw new Error('failed register')
            }
        },
        mutationKey: ['user-register'],
        onSuccess: () => {
            toast.success('Registration successful');
            navigate({ to: LoginRoute.to });
        },
        onError: (error) => {
            console.log('error : ', error.message);
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