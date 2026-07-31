import { totalUnreadCountAtom } from "@/atoms/notification";
import { BellIcon } from "@phosphor-icons/react";
import { useAtomValue } from "jotai";
import { useUnreadCountQuery } from "./notification";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

export default function NotificationBell({
    isNotificationRoute,
    hanleClick
}: {
    isNotificationRoute: boolean,
    hanleClick: () => void
}) {
    const totalUnreadCount = useAtomValue(totalUnreadCountAtom);
    useUnreadCountQuery();
    useNotificationSocket();

    return (
        <div className="indicator mr-3">
            {totalUnreadCount > 0 && <span className="indicator-item badge badge-xs badge-primary">{totalUnreadCount}</span>}
            <button onClick={hanleClick} className="btn btn-square md:inline-flex">
                {isNotificationRoute ? <BellIcon size={24} weight="fill" /> : <BellIcon size={24} />}
            </button>
        </div>
    );
}