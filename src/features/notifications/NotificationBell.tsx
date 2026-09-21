import { totalUnreadCountAtom } from "@/atoms/notification";
import { BellIcon } from "@phosphor-icons/react";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";

export default function NotificationBell({
  isNotificationRoute,
  hanleClick,
}: {
  isNotificationRoute: boolean;
  hanleClick: () => void;
}) {
  const { t } = useTranslation();
  const totalUnreadCount = useAtomValue(totalUnreadCountAtom);

  return (
    <div
      className="hidden md:inline-flex items-center md:tooltip md:tooltip-bottom mr-5"
      data-tip={t("nav.notificationBell.tooltip")}
    >
      <div
        className="indicator text-base-content/65 hover:text-base-content"
        onClick={hanleClick}
      >
        {isNotificationRoute ? (
          <BellIcon size={24} weight="fill" />
        ) : (
          <BellIcon size={24} />
        )}
        {totalUnreadCount > 0 && (
          <span className="indicator-item badge badge-xs badge-primary">
            {totalUnreadCount}
          </span>
        )}
      </div>
    </div>
  );
}
