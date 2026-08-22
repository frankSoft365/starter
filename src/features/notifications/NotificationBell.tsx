import { totalUnreadCountAtom } from "@/atoms/notification";
import { BellIcon } from "@phosphor-icons/react";
import { useAtomValue } from "jotai";
import { useUnreadCountQuery } from "./notification";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { useTranslation } from "react-i18next";

export default function NotificationBell({
    isNotificationRoute,
    hanleClick
}: {
    isNotificationRoute: boolean,
    hanleClick: () => void
}) {
    const { t } = useTranslation();
    const totalUnreadCount = useAtomValue(totalUnreadCountAtom);
    useUnreadCountQuery();
    useNotificationSocket();

    return (
        <div className="hidden md:inline-flex md:tooltip md:tooltip-bottom mr-3" data-tip={t('nav.notificationBell.tooltip')}>
            <div className="indicator">
                {totalUnreadCount > 0 && <span className="indicator-item badge badge-xs badge-primary">{totalUnreadCount}</span>}
                <button onClick={hanleClick} className="btn btn-square md:inline-flex">
                    {isNotificationRoute ? <BellIcon size={24} weight="fill" /> : <BellIcon size={24} />}
                </button>
            </div>
        </div>
    );
}