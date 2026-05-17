import { HeartIcon } from "@phosphor-icons/react";

export default function ArticleListItem() {
    return (
        <li className="list-row h-64">
            <div>
                <div className="flex flex-row gap-4">
                    <img className="size-8 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" />
                    <div className="list-col-wrap text-lg md:text-xl">Dio Lupa</div>
                </div>
                {/* title */}
                <div className="text-2xl md:text-4xl font-serif font-bold text-wrap mt-2.5 mb-2.5">
                    Why Reading More Books Wasn’t Making Me Smarter
                </div>
                <div className="list-col-wrap text-base md:text-xl font-extralight text-wrap">
                    "Remaining Reason" became an instant hit, praised for its haunting sound and emotional depth. A viral performance brought it widespread recognition, making it one of Dio Lupa’s most iconic tracks.
                </div>
            </div>
            <button className="btn btn-error btn-square btn-ghost">
                <div className="lg:tooltip" data-tip="Like">
                    <HeartIcon size={24} />
                </div>
            </button>
        </li>
    );
}