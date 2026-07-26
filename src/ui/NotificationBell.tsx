import { totalUnreadCountAtom, unreadCountAtom } from "@/atoms/notification";
import { getUnreadCount } from "@/services/apiNotification";
import { BellIcon } from "@phosphor-icons/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export default function NotificationBell({
    isNotificationRoute,
    hanleClick
}: {
    isNotificationRoute: boolean,
    hanleClick: () => void
}) {
    const setUnreadCount = useSetAtom(unreadCountAtom);
    const totalUnreadCount = useAtomValue(totalUnreadCountAtom);
    useEffect(() => {
        async function fetchUnreadCount() {
            const unreadCount = await getUnreadCount();
            setUnreadCount(unreadCount);
        }
        fetchUnreadCount();
    }, []);

    return (
        <div className="indicator mr-3">
            {totalUnreadCount > 0 && <span className="indicator-item badge badge-xs badge-primary">{totalUnreadCount}</span>}
            <button onClick={hanleClick} className="btn btn-square md:inline-flex">
                {isNotificationRoute ? <BellIcon size={24} weight="fill" /> : <BellIcon size={24} />}
            </button>
        </div>
    );
}