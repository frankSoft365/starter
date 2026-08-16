import { useForm } from "@tanstack/react-form"
import FieldInfo from "@/ui/FieldInfo"
import { useChangePassword } from "./userProfile"
import { ChangePasswordSchema, type ChangePasswordForm } from "@/schemas/account"
import { useTranslation } from "react-i18next"

export default function ChangePasswordForm() {
    const { t } = useTranslation();
    const { handleChangePassword, isChanging } = useChangePassword();

    const defaultValues: ChangePasswordForm = { currentPassword: '', newPassword: '' }

    const form = useForm({
        defaultValues: defaultValues,
        onSubmit: ({ value }) => {
            handleChangePassword(value);
        },
        validators: {
            onChange: ChangePasswordSchema,
            onSubmit: ChangePasswordSchema
        },
    });

    return (
        <main className="mx-auto">
            <div className="card w-11/12 md:w-3xl bg-base-100 md:card-xl shadow-sm mx-auto my-8">
                <div className="card-body w-full">
                    <h2 className="card-title">{t('settings.changePassword.title')}</h2>
                    <h3 className="text-xs">{t('settings.changePassword.description')}</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            form.handleSubmit()
                        }}
                    >
                        <form.Field
                            name="currentPassword"
                            children={(field) => (
                                <>
                                    <fieldset className="fieldset w-full">
                                        <legend className="fieldset-legend">{t('settings.changePassword.currentPassword')}</legend>
                                        <input
                                            disabled={isChanging}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            type="password"
                                            className="input w-full"
                                            placeholder={t('settings.changePassword.placeholder')}
                                        />
                                    </fieldset>
                                    <FieldInfo field={field} />
                                </>
                            )}
                        />
                        <form.Field
                            name="newPassword"
                            children={(field) => (
                                <>
                                    <fieldset className="fieldset w-full">
                                        <legend className="fieldset-legend">{t('settings.changePassword.newPassword')}</legend>
                                        <div className="flex items-center gap-2">
                                            <input
                                                disabled={isChanging}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                type="password"
                                                className="input w-full"
                                                placeholder={t('settings.changePassword.placeholder')}
                                            />
                                        </div>
                                    </fieldset>

                                    <FieldInfo field={field} />
                                </>
                            )}
                        />
                        <div className="card-actions justify-end">
                            <button disabled={isChanging} type="submit" className="btn btn-neutral mt-4">
                                {!isChanging && t('settings.changePassword.save')}
                                {isChanging && <span className="loading loading-spinner"></span>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}