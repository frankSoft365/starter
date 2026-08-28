import { useLocation, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { unreadCountAtom } from "@/atoms/notification";
import { Route as notificationsIndexRoute } from "@/routes/_app/_protected/me/notifications/index";
import { Route as notificationsLikeRoute } from "@/routes/_app/_protected/me/notifications/like";
import { Route as notificationsFollowRoute } from "@/routes/_app/_protected/me/notifications/follow";
import NormalLayout from "@/ui/NormalLayout";

type NotificationListType = "reply" | "like" | "follow";

const unreadCountFieldMap: Record<
  NotificationListType,
  "replyCount" | "likeCount" | "followCount"
> = {
  reply: "replyCount",
  like: "likeCount",
  follow: "followCount",
};

export default function NotificationsTab({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const unreadCount = useAtomValue(unreadCountAtom);

  const notificationTabMap: {
    name: string;
    path: string;
    type: NotificationListType;
  }[] = [
    {
      name: t("notification.tab.reply"),
      path: notificationsIndexRoute.to,
      type: "reply",
    },
    {
      name: t("notification.tab.like"),
      path: notificationsLikeRoute.to,
      type: "like",
    },
    {
      name: t("notification.tab.follow"),
      path: notificationsFollowRoute.to,
      type: "follow",
    },
  ];

  return (
    <NormalLayout>
      <div className="w-full md:w-3xl">
        <div className="w-full text-3xl md:text-4xl m-4 font-bold">
          {t("notification.title")}
        </div>
        <ul className="menu bg-base-100 menu-horizontal shadow-xs">
          {notificationTabMap.map((item) => {
            const count =
              Number(unreadCount[unreadCountFieldMap[item.type]]) || 0;
            return (
              <li key={item.path}>
                <a
                  className={
                    location.pathname === item.path ? "menu-active" : ""
                  }
                  onClick={() => navigate({ to: item.path })}
                >
                  {item.name}
                  {count > 0 && (
                    <span className="badge badge-xs badge-primary">
                      {count}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
        <div>{children}</div>
      </div>
    </NormalLayout>
  );
}
