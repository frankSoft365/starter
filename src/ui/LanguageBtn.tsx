import { GlobeIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function LanguageBtn() {
    const { i18n } = useTranslation();
    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-square mr-3">
                <GlobeIcon size={24} />
            </div>
            <ul tabIndex={-1} className="dropdown-content bg-base-100 rounded-box z-1 w-32 p-2 shadow-2xl">
                <li>
                    <button onClick={() => i18n.changeLanguage("en")} className={`w-full btn btn-sm btn-block btn-ghost justify-start ${i18n.resolvedLanguage === "en" ? 'btn-active' : ''}`}>
                        EN
                    </button>
                </li>
                <li>
                    <button onClick={() => i18n.changeLanguage("zh-CN")} className={`w-full btn btn-sm btn-block btn-ghost justify-start ${i18n.resolvedLanguage === "zh-CN" ? 'btn-active' : ''}`}>
                        中文
                    </button>
                </li>
            </ul>
        </div>
    );
}