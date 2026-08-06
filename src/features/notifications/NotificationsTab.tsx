import NotificationList from "./NotificationList";
import { useTranslation } from "react-i18next";

export default function NotificationsTab() {
    const { t } = useTranslation();

    return (
        <div className="w-full md:w-3xl">
            <div className="w-full text-3xl md:text-4xl m-4 font-bold">{t('notification.title')}</div>
            <div className="tabs tabs-lift w-full">
                <input type="radio" name="profile_tabs_5" className="tab" aria-label={t('notification.tab.reply')} defaultChecked />
                <div className="tab-content bg-base-100 border-base-300">
                    <NotificationList type="reply" />
                </div>

                <input type="radio" name="profile_tabs_5" className="tab" aria-label={t('notification.tab.like')} />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                    {t('notification.tab.like')}
                </div>

                <input type="radio" name="profile_tabs_5" className="tab" aria-label={t('notification.tab.follow')} />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                    {t('notification.tab.follow')}
                </div>
            </div>
        </div>
    );
}
