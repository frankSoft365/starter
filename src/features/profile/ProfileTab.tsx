import { useLocation, useNavigate } from "@tanstack/react-router";
import { Route as homeRoute } from "@/routes/_app/_protected/profile/$userId/_profile/index";
import { Route as repostsRoute } from "@/routes/_app/_protected/profile/$userId/_profile/reposts";
import { Route as activityRoute } from "@/routes/_app/_protected/profile/$userId/_profile/activity";
import { Route as listsRoute } from "@/routes/_app/_protected/profile/$userId/_profile/lists";
import { Route as aboutRoute } from "@/routes/_app/_protected/profile/$userId/_profile/about";
import { useTranslation } from "react-i18next";
import { Route as profileTabRoute } from "@/routes/_app/_protected/profile/$userId/_profile/route";

export default function ProfileTab() {
  const { t } = useTranslation();
  const { userId } = profileTabRoute.useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const profileTabMap = [
    { name: t("profile.tab.home"), path: homeRoute.to },
    { name: t("profile.tab.reposts"), path: repostsRoute.to },
    { name: t("profile.tab.activity"), path: activityRoute.to },
    { name: t("profile.tab.lists"), path: listsRoute.to },
    { name: t("profile.tab.about"), path: aboutRoute.to },
  ];

  return (
    <div role="tablist" className="tabs tabs-border w-full">
      {profileTabMap.map((item, index) => {
        return (
          <a
            role="tab"
            key={index}
            className={`tab ${
              location.pathname === item.path.replace("$userId", userId)
                ? "tab-active"
                : ""
            }`}
            onClick={() =>
              navigate({ to: item.path, params: { userId: userId } })
            }
          >
            {item.name}
          </a>
        );
      })}
    </div>
  );
}
