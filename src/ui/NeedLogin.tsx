import { Link, useNavigate } from "@tanstack/react-router";
import { Route as LoginRoute } from "../routes/login";
import { useTranslation } from "react-i18next";

export default function NeedLogin() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="mockup-browser border border-base-300 w-full min-h-screen">
            <div className="mockup-browser-toolbar">
                <div className="input"><Link to={LoginRoute.to}>/login</Link></div>
            </div>
            <div className="grid place-content-center border-t border-base-300 h-80">
                <h1>{t('auth.needLogin.title')}</h1>
                <br />
                <button
                    className="btn btn-info"
                    onClick={() => navigate({
                        to: LoginRoute.to,
                    })}
                >
                    {t('auth.needLogin.goToLogin')}
                </button>
            </div>
        </div>
    );
}
