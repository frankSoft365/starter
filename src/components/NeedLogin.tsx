import { Link, useNavigate } from "@tanstack/react-router";
import { Route as LoginRoute } from "../routes/login";

export default function NeedLogin() {
    const navigate = useNavigate();
    return (
        <div className="mockup-browser border border-base-300 w-full min-h-screen">
            <div className="mockup-browser-toolbar">
                <div className="input"><Link to={LoginRoute.to}>/login</Link></div>
            </div>
            <div className="grid place-content-center border-t border-base-300 h-80">
                <h1>This page requires login to view.</h1>
                <br />
                <button
                    className="btn btn-info"
                    onClick={() => navigate({
                        to: LoginRoute.to,
                    })}
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
}