import { Link } from "@tanstack/react-router";
import { useUserLogin } from "./userLogin";
import { useForm } from "@tanstack/react-form";
import { LoginSchema, type LoginForm } from "@/schemas/auth";
import FieldInfo from "@/ui/FieldInfo";

export default function LoginForm() {
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
            className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8"
        >
            <legend className="fieldset-legend text-2xl">Login</legend>
            <div className="text-left mb-4">Enter your email below to login to your account</div>

            <form.Field
                name="email"
                children={(field) => (
                    <>
                        <label className="label">Email</label>
                        <input
                            disabled={isLoggingIn}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="input"
                            type="email"
                            placeholder="Email"
                        />
                        <FieldInfo field={field} />
                    </>
                )}
            />

            <form.Field
                name="password"
                children={(field) => (
                    <>
                        <label className="label">Password</label>
                        <input
                            disabled={isLoggingIn}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="password"
                            className="input"
                            placeholder="Password"
                        />
                        <FieldInfo field={field} />
                    </>
                )}
            />

            <button disabled={isLoggingIn} type="submit" className="btn btn-neutral mt-4">
                {isLoggingIn ? <span className="loading loading-spinner"></span> : 'Login'}
            </button>

            <div className="text-center mt-4">Don't have an account? <Link className="link link-error font-bold" to="/register">Sign Up</Link></div>
        </form>
    );
}