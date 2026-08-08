import { Link } from "@tanstack/react-router";
import { useUserLogin } from "./userLogin";
import { useForm } from "@tanstack/react-form";
import { LoginSchema, type LoginForm } from "@/schemas/auth";
import FieldInfo from "@/ui/FieldInfo";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
    const { t } = useTranslation();
    const {
        userLogin,
        isLoggingIn,
    } = useUserLogin();

    const defaultValues: LoginForm = {
        email: '',
        password: ''
    }

    const form = useForm({
        defaultValues: defaultValues,
        onSubmit: ({ value }) => {
            userLogin({ value });
        },
        validators: {
            onBlur: LoginSchema,
            onSubmit: LoginSchema
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
            }}
            className="fieldset bg-base-200 border-base-300 rounded-box w-xs md:w-sm border p-4 md:p-5"
        >
            <legend className="fieldset-legend text-xl md:text-2xl">{t('auth.login.title')}</legend>
            <div className="text-left mb-4">{t('auth.login.subtitle')}</div>
            <form.Field
                name="email"
                children={(field) => (
                    <>
                        <label className="label">{t('auth.login.emailLabel')}</label>
                        <input
                            disabled={isLoggingIn}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="input w-full"
                            type="email"
                            placeholder={t('auth.login.emailPlaceholder')}
                        />
                        <FieldInfo field={field} />
                    </>
                )}
            />
            <form.Field
                name="password"
                children={(field) => (
                    <>
                        <label className="label">{t('auth.login.passwordLabel')}</label>
                        <input
                            disabled={isLoggingIn}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="password"
                            className="input w-full"
                            placeholder={t('auth.login.passwordPlaceholder')}
                        />
                        <FieldInfo field={field} />
                    </>
                )}
            />
            <button disabled={isLoggingIn} type="submit" className="btn btn-neutral mt-4">
                {isLoggingIn ? <span className="loading loading-spinner"></span> : t('btn.login')}
            </button>
            <div className="text-center mt-4">{t('auth.login.noAccount')} <Link className="link link-error font-bold" to="/register">{t('auth.login.signUp')}</Link></div>
        </form>
    );
}
