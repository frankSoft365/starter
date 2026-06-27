import { Link } from "@tanstack/react-router";
import { useUserLogin } from "./userLogin";

export default function LoginForm() {
    const {
        userLogin,
        isLoggingIn,
        email,
        setEmail,
        password,
        setPassword
    } = useUserLogin();

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                userLogin({ email, password });
            }}
            className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8"
        >
            <legend className="fieldset-legend text-2xl">Login</legend>
            <div className="text-left mb-4">Enter your email below to login to your account</div>

            <label className="label">Email</label>

            <input
                type="email"
                placeholder="Email"
                disabled={isLoggingIn}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input validator"
                required
            />

            <label className="label">Password</label>
            <input
                type="password"
                className="input validator"
                placeholder="Password"
                required
                disabled={isLoggingIn}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern="^[a-zA-Z0-9!@#$%*+=_\-]+$"
                minLength={6}
                maxLength={20}
                title="Only letters, numbers or dash"
            />

            <button disabled={isLoggingIn} type="submit" className="btn btn-neutral mt-4">
                {isLoggingIn ? <span className="loading loading-spinner"></span> : 'Login'}
            </button>

            <div className="text-center mt-4">Don't have an account? <Link className="link link-error font-bold" to="/register">Sign Up</Link></div>
        </form>
    );
}