import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTimer, useVerificationEmail } from './verificationEmail';
import { Route as LoginRoute } from "@/routes/login";

export type RegisterStep = 'EMAIL' | 'VERIFY' | 'USERINFO';

export default function RegisterForm() {
    const [step, setStep] = useState<RegisterStep>('EMAIL');
    const navigate = useNavigate();

    const {
        timer,
        setTimer,
        canResend,
        setCanResend
    } = useTimer();

    const {
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
    } = useVerificationEmail();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        sendVerificationCode({}, {
            onSuccess: () => {
                setTimer(60);
                setCanResend(false);
                setStep('VERIFY');
            }
        });
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        verifyCode({}, {
            onSuccess: () => {
                setStep('USERINFO');
            }
        });

    };

    const handleUserInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) return;
        registerUser({}, {
            onSuccess: () => {
                navigate({ to: LoginRoute.to });
            }
        });
    };

    return (
        <div>
            {step === 'EMAIL' && (
                <form onSubmit={handleEmailSubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8">
                    <legend className="fieldset-legend text-2xl">Register</legend>
                    <div className="text-left mb-4">Enter your information to create an account</div>

                    <label className="label">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder="Email" />

                    <button
                        type="submit"
                        disabled={!email || isSending}
                        className="btn btn-neutral mt-4"
                    >
                        {isSending && <span className="loading loading-spinner"></span>}
                        {!isSending && 'Register with Email'}
                    </button>

                    <div className="text-center mt-4">Already have an account? <Link className="link link-error font-bold" to="/login">Sign In</Link></div>
                </form>
            )}
            {step === 'VERIFY' && (
                <form onSubmit={handleVerifySubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8">
                    <legend className="fieldset-legend text-2xl">Register</legend>
                    <div className="text-left mb-4">Enter your information to create an account</div>

                    <label className="label">Verify Code</label>
                    <input value={code} onChange={(e) => setCode(e.target.value)} name="code" type="text" maxLength={6} className="input" placeholder="Verify Code" />

                    <button type="submit" disabled={!code || isVerifying} className="btn btn-neutral mt-4">
                        {isVerifying && <span className="loading loading-spinner"></span>}
                        {!isVerifying && 'Verify'}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary mt-4"
                        disabled={!canResend}
                        onClick={() => sendVerificationCode({}, {
                            onSuccess: () => {
                                setTimer(60);
                                setCanResend(false);
                                setStep('VERIFY');
                            }
                        })}
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
                    <input value={username} onChange={(e) => setUsername(e.target.value)} name="username" type="text" className="input" placeholder="Username" minLength={6} maxLength={20} />

                    <label className="label">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" className="input" placeholder="Password" minLength={6} maxLength={20} />

                    <button type="submit" className="btn btn-neutral mt-4" disabled={isRegister}>
                        {isRegister && <span className="loading loading-spinner"></span>}
                        {!isRegister && 'Create account'}
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline btn-accent mt-4"
                        onClick={() => location.reload()}
                    >
                        Re-register
                    </button>

                    <div className="text-center mt-4">Already have an account? <Link className="link link-error font-bold" to="/login">Sign In</Link></div>
                </form>
            )}
        </div>
    );
}