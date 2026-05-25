import { Link, useNavigate } from "@tanstack/react-router";
import request from '../utils/request'
import { doLoginAtom } from "../stores/user";
import { useAtom } from "jotai";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [, login] = useAtom(doLoginAtom)
    const navigate = useNavigate()

    const { mutate: handleLogin, isPending: isLogining } = useMutation({
        mutationFn: async () => {
            const res = await request.post('/user/login', { email, password })
            const baseResult = res.data;
            if (baseResult.code !== 0) {
                throw new Error(baseResult.description);
            }
            return baseResult
        },
        onSuccess: (baseResult) => {
            toast.success('Login successful');
            login(baseResult.data.token);
            navigate({ to: '/' })
        },
        onError: (error) => {
            console.log('error', error.message);
        }
    })

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                handleLogin();
            }}
            className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8"
        >
            <legend className="fieldset-legend text-2xl">Login</legend>
            <div className="text-left mb-4">Enter your email below to login to your account</div>

            <label className="label">Email</label>

            <input
                type="email"
                placeholder="Email"
                disabled={isLogining}
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
                disabled={isLogining}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern="^[a-zA-Z0-9!@#$%*+=_\-]+$"
                minLength={6}
                maxLength={20}
                title="Only letters, numbers or dash"
            />

            <button type="submit" className="btn btn-neutral mt-4">Login</button>

            <div className="text-center mt-4">Don't have an account? <Link className="link link-error font-bold" to="/register">Sign Up</Link></div>
        </form>
    );
}