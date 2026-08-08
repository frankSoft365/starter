import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute(
    '/_app/_protected/me/notifications/follow',
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { t } = useTranslation();
    return (
        <div className="p-6">
            {t('notification.tab.follow')}
        </div>
    );
}
