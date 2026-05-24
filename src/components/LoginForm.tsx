import { Link, useNavigate } from "@tanstack/react-router";
import request from '../utils/request'
import { doLoginAtom } from "../stores/user";
import { useAtom } from "jotai";
import { toast } from "sonner";

export default function LoginForm() {

    const [, login] = useAtom(doLoginAtom)
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        // 模拟登录接口
        const res = await request.post('/user/login', { email, password })
        if (res.data.code === 0) {
            login(res.data.data.token);
            navigate({ to: '/' })
        }
    }
    return (
        <form onSubmit={handleLogin} className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-8">
            <legend className="fieldset-legend text-2xl">Login</legend>
            <div className="text-left mb-4">Enter your email below to login to your account</div>

            <label className="label">Email</label>
            <input name="email" type="email" className="input" placeholder="Email" />

            <label className="label">Password</label>
            <input name="password" type="password" className="input" placeholder="Password" />

            <button type="submit" className="btn btn-neutral mt-4">Login</button>

            <div className="text-center mt-4">Don't have an account? <Link className="link link-error font-bold" to="/register">Sign Up</Link></div>
        </form>
    );
}