import MyArticleList from "./MyArticleList";

export default function ProfileTab() {


    return (
        <div className="tabs tabs-lift w-full md:w-3xl">
            <input type="radio" name="profile_tabs_5" className="tab" aria-label="Home" defaultChecked />
            <div className="tab-content bg-base-100 border-base-300">
                <MyArticleList />
            </div>

            <input type="radio" name="profile_tabs_5" className="tab" aria-label="Reposts" />
            <div className="tab-content bg-base-100 border-base-300 p-6">Reposts</div>

            <input type="radio" name="profile_tabs_5" className="tab" aria-label="Activity" />
            <div className="tab-content bg-base-100 border-base-300 p-6">Activity</div>

            <input type="radio" name="profile_tabs_5" className="tab" aria-label="Lists" />
            <div className="tab-content bg-base-100 border-base-300 p-6">Lists</div>

            <input type="radio" name="profile_tabs_5" className="tab" aria-label="About" />
            <div className="tab-content bg-base-100 border-base-300 p-6">About</div>
        </div>
    );
}