import { Link, useNavigate } from "@tanstack/react-router";
import request from '../utils/request'
import { toast } from 'sonner'
import { useEffect, useState } from "react";

type RegisterStep = 'EMAIL' | 'VERIFY' | 'USERINFO';

export default function RegisterForm() {
    const [step, setStep] = useState<RegisterStep>('EMAIL');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [timer, setTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);

    const navigate = useNavigate()

    // const handleRegister = async (e: React.FormEvent) => {
    //     e.preventDefault()
    //     const formData = new FormData(e.target as HTMLFormElement)
    //     const data = {
    //         username: formData.get('username'),
    //         email: formData.get('email'),
    //         password: formData.get('password')
    //     }
    //     const res = await request.post('/user/register', data)
    //     if (res.data.code === 0) {
    //         navigate({ to: '/login' })
    //     } else {
    //         toast.error('register error');
    //     }
    // }
    // ------------------ API 模拟 ------------------
    const sendVerificationCode = async (email: string) => {
        console.log('发送验证码到', email);
        setTimer(60);
        setCanResend(false);
        return true;
    };

    const verifyCode = async (email: string, code: string) => {
        console.log('验证', email, code);
        return code === '123456';
    };

    const registerUser = async (email: string, username: string, password: string) => {
        console.log('注册', { email, username, password });
        return true;
    };

    // ------------------ 倒计时效果 ------------------
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

    // ------------------ 表单提交 ------------------
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        const success = await sendVerificationCode(email);
        if (success) setStep('VERIFY');
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await verifyCode(email, code);
        if (success) setStep('USERINFO');
        else alert('验证码错误');
    };

    const handleUserInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;
        const success = await registerUser(email, username, password);
        if (success) alert('注册成功！');
    };

    return (
        <div>
            {step === 'EMAIL' && (
                <form onSubmit={handleEmailSubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8">
                    <legend className="fieldset-legend text-2xl">Register</legend>
                    <div className="text-left mb-4">Enter your information to create an account</div>

                    <label className="label">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder="Email" />

                    <button type="submit" disabled={!email} className="btn btn-neutral mt-4">Register with Email</button>

                    <div className="text-center mt-4">Already have an account? <Link className="link link-error font-bold" to="/login">Sign In</Link></div>
                </form>
            )}
            {step === 'VERIFY' && (
                <form onSubmit={handleVerifySubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8">
                    <legend className="fieldset-legend text-2xl">Register</legend>
                    <div className="text-left mb-4">Enter your information to create an account</div>

                    <label className="label">Verify Code</label>
                    <input value={code} onChange={(e) => setCode(e.target.value)} name="code" type="text" maxLength={6} className="input" placeholder="Verify Code" />

                    <button type="submit" disabled={!code} className="btn btn-neutral mt-4">Verify</button>

                    <button
                        type="button"
                        className="btn btn-secondary mt-4"
                        disabled={!canResend}
                        onClick={() => sendVerificationCode(email)}
                    >
                        {canResend ? 'Resend Code' : `Resend in ${timer}s`}
                    </button>

                    <div className="text-center mt-4">Already have an account? <Link className="link link-error font-bold" to="/login">Sign In</Link></div>
                </form>
            )}
            {step === 'USERINFO' && (
                <form onSubmit={handleUserInfoSubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8">
                    <legend className="fieldset-legend text-2xl">Register</legend>
                    <div className="text-left mb-4">Enter your information to create an account</div>

                    <label className="label">Email</label>
                    <input disabled={true} name="email" type="email" className="input" placeholder={email} />

                    <label className="label">Username</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} name="username" type="text" className="input" placeholder="Username" />

                    <label className="label">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" className="input" placeholder="Password" />

                    <button type="submit" className="btn btn-neutral mt-4">Create account</button>

                    <div className="text-center mt-4">Already have an account? <Link className="link link-error font-bold" to="/login">Sign In</Link></div>
                </form>
            )}
        </div>
    );
}