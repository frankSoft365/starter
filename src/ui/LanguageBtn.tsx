import { useTranslation } from "react-i18next";

export default function LanguageBtn() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "en" ? "en" : "zh-CN";

  return (
    <select
      className="select select-xs"
      value={language}
      onChange={(e) => {
        i18n.changeLanguage(e.target.value);
      }}
    >
      <option value="zh-CN">中文</option>
      <option value="en">EN</option>
    </select>
  );
}
