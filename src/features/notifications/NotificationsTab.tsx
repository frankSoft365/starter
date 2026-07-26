import NotificationList from "./NotificationList";

export default function NotificationsTab() {

    return (
        <div className="w-full md:w-3xl">
            <div className="w-full text-3xl md:text-4xl m-4 font-bold">Notifications</div>
            <div className="tabs tabs-lift w-full">
                <input type="radio" name="profile_tabs_5" className="tab" aria-label="Reply" defaultChecked />
                <div className="tab-content bg-base-100 border-base-300">
                    <NotificationList type="reply" />
                </div>

                <input type="radio" name="profile_tabs_5" className="tab" aria-label="Like" />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                    Like
                </div>

                <input type="radio" name="profile_tabs_5" className="tab" aria-label="Follow" />
                <div className="tab-content bg-base-100 border-base-300 p-6">
                    Follow
                </div>
            </div>
        </div>
    );
}