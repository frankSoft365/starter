import { HeartIcon } from "@phosphor-icons/react";
import type { ArticleListItemVO } from "../types/article";

export default function ArticleListItem({ article }: { article: ArticleListItemVO }) {



    return (
        <li className="list-row h-64">
            <div>
                <div className="flex flex-row gap-4">
                    <img className="size-8 rounded-box" src={article.authorAvatar} />
                    <div className="list-col-wrap text-lg md:text-xl">{article.authorName}</div>
                </div>
                {/* title */}
                <div className="text-2xl md:text-4xl font-serif font-bold text-wrap mt-2.5 mb-2.5">
                    {article.title}
                </div>
                <div className="list-col-wrap text-base md:text-xl font-extralight text-wrap">
                    {article.subtitle}
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