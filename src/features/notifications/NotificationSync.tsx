import { useNotificationSocket } from "@/hooks/useNotificationSocket";
import { useUnreadCountQuery } from "./notification";

export default function NotificationSync() {
    useUnreadCountQuery();
    useNotificationSocket();

    return null;
}
