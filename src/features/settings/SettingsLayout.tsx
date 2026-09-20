import { useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Route as settingsIndexRoute } from "@/routes/_app/_protected/me/settings/index";
import { Route as settingsLanguageRoute } from "@/routes/_app/_protected/me/settings/language";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const settingsTabMap: {
    name: string;
    path: string;
    type: "account" | "language";
  }[] = [
    {
      name: t("settings.tab.account"),
      path: settingsIndexRoute.to,
      type: "account",
    },
    {
      name: t("settings.tab.language"),
      path: settingsLanguageRoute.to,
      type: "language",
    },
  ];
  return (
    <div className="w-full min-h-dvh grid grid-cols-1 lg:grid-cols-3">
      <div className="col-span-1 lg:col-span-2 border-r border-base-300">
        <div className="w-11/12 md:w-5/6 m-auto">
          <h1 className="text-3xl md:text-5xl font-bold my-4">
            {t("settings.page.title")}
          </h1>
          {/* tab */}
          <div role="tablist" className="tabs tabs-border">
            {settingsTabMap.map((item) => {
              return (
                <a
                  role="tab"
                  key={item.path}
                  className={`tab ${location.pathname === item.path ? "tab-active" : ""}`}
                  onClick={() => navigate({ to: item.path })}
                >
                  {item.name}
                </a>
              );
            })}
          </div>
          {children}
        </div>
      </div>
      <div className="hidden lg:inline-flex md:items-start md:col-span-1 md:p-4">
        <div className="avatar">
          <div className="w-24 rounded-xl">
            <img
              alt="Tailwind-CSS-Avatar-component"
              src="https://img.daisyui.com/images/profile/demo/yellingwoman@192.webp"
            />
          </div>
        </div>
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img
              alt="Tailwind-CSS-Avatar-component"
              src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
