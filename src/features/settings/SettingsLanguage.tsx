import LanguageBtn from "@/ui/LanguageBtn";
import { useTranslation } from "react-i18next";

export default function SettingsLanguage() {
  const { t } = useTranslation();
  return (
    <ul className="list bg-base-100 rounded-box shadow-sm w-full my-4">
      <li className="list-row">
        <div className="">{t("settings.language")}</div>
        <div></div>
        <LanguageBtn />
      </li>
    </ul>
  );
}
