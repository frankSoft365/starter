import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getVerificationCode, userRegister, verifyVerificationCode } from "@/services/apiUserRegister";
import { toast } from "sonner";
import type { SendCodeRequest, UserRegisterRequest, VerifyCodeRequest } from "@/types/user";

export function useVerificationEmail() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const { mutate: sendVerificationCode, isPending: isSending } = useMutation({
        mutationFn: async ({ }: {}) => {
            const request = {
                email
            } as SendCodeRequest;
            await getVerificationCode(request);
        },
        mutationKey: ['send-verification-code'],
        onSuccess: () => {
            toast.success('Verification code has been sent');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });


    const { mutate: verifyCode, isPending: isVerifying } = useMutation({
        mutationFn: async ({ }: {}) => {
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
            toast.success('Email verification successful');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });


    const { mutate: registerUser, isPending: isRegister } = useMutation({
        mutationFn: async ({ }: {}) => {
            const request = {
                token,
                username,
                password
            } as UserRegisterRequest;
            await userRegister(request);
        },
        mutationKey: ['user-register'],
        onSuccess: () => {
            toast.success('Registration successful');
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