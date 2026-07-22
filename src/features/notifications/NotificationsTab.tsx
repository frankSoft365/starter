import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";

export default function NotificationsTab() {
    const user = useAtomValue(userAtom);

    return (
        <div className="w-full md:w-3xl">
            <div className="w-full text-3xl md:text-4xl m-4 font-bold">Notifications</div>
            <div className="tabs tabs-lift w-full">
                <input type="radio" name="profile_tabs_5" className="tab" aria-label="Home" defaultChecked />
                <div className="tab-content bg-base-100 border-base-300">
                    Home
                </div>

                <input type="radio" name="profile_tabs_5" className="tab" aria-label="Reposts" />
                <div className="tab-content bg-base-100 border-base-300 p-6">Reposts</div>

                <input type="radio" name="profile_tabs_5" className="tab" aria-label="Activity" />
                <div className="tab-content bg-base-100 border-base-300 p-6">Activity</div>
            </div>
        </div>
    );
}