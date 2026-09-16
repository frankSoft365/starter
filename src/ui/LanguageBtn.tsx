import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageBtn() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.resolvedLanguage || "zh-CN");
  return (
    <select
      defaultValue="中文"
      className="select select-xs"
      value={language}
      onChange={(e) => {
        setLanguage(e.target.value);
        i18n.changeLanguage(e.target.value);
      }}
    >
      <option value="zh-CN">中文</option>
      <option value="en">EN</option>
    </select>
  );
}
