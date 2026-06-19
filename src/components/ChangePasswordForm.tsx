import { useForm } from "@tanstack/react-form"
import FieldInfo from "./FieldInfo"
import { useChangePassword } from "./userProfile"
import * as z from "zod";

interface ChangePassword {
    currentPassword: string
    newPassword: string
}

const PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%*+=_\-]+$/;

const PasswordSchema = z.string()
    .min(1, "Password is required")
    .min(6, "Password must be between 6 and 20 characters.")
    .max(20, "Password must be between 6 and 20 characters.")
    .regex(PASSWORD_REGEX, "Password does not match required format");

const ChangePasswordSchema = z.object({
    currentPassword: PasswordSchema,
    newPassword: PasswordSchema
});

export default function ChangePasswordForm() {

    const { handleChangePassword, isChanging } = useChangePassword();

    const defaultValues: ChangePassword = { currentPassword: '', newPassword: '' }

    const form = useForm({
        defaultValues: defaultValues,
        onSubmit: ({ value }) => {
            handleChangePassword(value);
        },
        validators: {
            onChange: ChangePasswordSchema,
            onSubmit: ChangePasswordSchema
        },
    })

    return (
        <main className="mx-auto">
            <div className="card w-3xl bg-base-100 card-xl shadow-sm mx-auto mt-8">
                <div className="card-body w-full">
                    <h2 className="card-title">Change Password</h2>
                    <h3 className="text-xs">Enter your current password and a new password.</h3>
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
                                        <legend className="fieldset-legend">Current Password</legend>
                                        <input
                                            disabled={isChanging}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            type="password"
                                            className="input w-full"
                                            placeholder="Current Password"
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
                                        <legend className="fieldset-legend">New Password</legend>
                                        <div className="flex items-center gap-2">
                                            <input
                                                disabled={isChanging}
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                type="password"
                                                className="input w-full"
                                                placeholder="New Password"
                                            />
                                        </div>
                                    </fieldset>

                                    <FieldInfo field={field} />
                                </>
                            )}
                        />
                        <div className="card-actions justify-end">
                            <button disabled={isChanging} type="submit" className="btn btn-neutral mt-4">
                                {!isChanging && 'Save'}
                                {isChanging && <span className="loading loading-spinner"></span>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>

    );
}