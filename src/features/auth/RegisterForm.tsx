import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTimer, useVerificationEmail } from './verificationEmail';
import { Route as LoginRoute } from "@/routes/login";
import { useTranslation } from "react-i18next";

export type RegisterStep = 'EMAIL' | 'VERIFY' | 'USERINFO';

export default function RegisterForm() {
    const { t } = useTranslation();
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
                    <legend className="fieldset-legend text-2xl">{t('auth.register.title')}</legend>
                    <div className="text-left mb-4">{t('auth.register.subtitle')}</div>

                    <label className="label">{t('auth.register.emailLabel')}</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" placeholder={t('auth.register.emailPlaceholder')} />

                    <button
                        type="submit"
                        disabled={!email || isSending}
                        className="btn btn-neutral mt-4"
                    >
                        {isSending && <span className="loading loading-spinner"></span>}
                        {!isSending && t('auth.register.registerWithEmail')}
                    </button>

                    <div className="text-center mt-4">{t('auth.register.hasAccount')} <Link className="link link-error font-bold" to="/login">{t('auth.register.signIn')}</Link></div>
                </form>
            )}
            {step === 'VERIFY' && (
                <form onSubmit={handleVerifySubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8">
                    <legend className="fieldset-legend text-2xl">{t('auth.register.title')}</legend>
                    <div className="text-left mb-4">{t('auth.register.subtitle')}</div>

                    <label className="label">{t('auth.register.verifyCodeLabel')}</label>
                    <input value={code} onChange={(e) => setCode(e.target.value)} name="code" type="text" maxLength={6} className="input" placeholder={t('auth.register.verifyCodePlaceholder')} />

                    <button type="submit" disabled={!code || isVerifying} className="btn btn-neutral mt-4">
                        {isVerifying && <span className="loading loading-spinner"></span>}
                        {!isVerifying && t('auth.register.verify')}
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
                        {canResend ? t('auth.register.resendCode') : t('auth.register.resendIn', { seconds: timer })}
                    </button>

                    <div className="text-center mt-4">{t('auth.register.hasAccount')} <Link className="link link-error font-bold" to="/login">{t('auth.register.signIn')}</Link></div>
                </form>
            )}
            {step === 'USERINFO' && (
                <form onSubmit={handleUserInfoSubmit} className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8">
                    <legend className="fieldset-legend text-2xl">{t('auth.register.title')}</legend>
                    <div className="text-left mb-4">{t('auth.register.subtitle')}</div>

                    <label className="label">{t('auth.register.emailLabel')}</label>
                    <input disabled={true} name="email" type="email" className="input" placeholder={email} />

                    <label className="label">{t('auth.register.usernameLabel')}</label>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} name="username" type="text" className="input" placeholder={t('auth.register.usernamePlaceholder')} minLength={6} maxLength={20} />

                    <label className="label">{t('auth.register.passwordLabel')}</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" className="input" placeholder={t('auth.register.passwordPlaceholder')} minLength={6} maxLength={20} />

                    <button type="submit" className="btn btn-neutral mt-4" disabled={isRegister}>
                        {isRegister && <span className="loading loading-spinner"></span>}
                        {!isRegister && t('auth.register.createAccount')}
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline btn-accent mt-4"
                        onClick={() => location.reload()}
                    >
                        {t('auth.register.reRegister')}
                    </button>

                    <div className="text-center mt-4">{t('auth.register.hasAccount')} <Link className="link link-error font-bold" to="/login">{t('auth.register.signIn')}</Link></div>
                </form>
            )}
        </div>
    );
}
