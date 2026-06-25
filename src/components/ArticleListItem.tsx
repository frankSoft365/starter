import { BookmarkIcon, ChatCircleDotsIcon, DotsThreeIcon, HandsClappingIcon, RepeatIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import type { ArticleListItemVO } from "../types/article";
import Avatar from "./Avatar";

export default function ArticleListItem({ article }: { article: ArticleListItemVO }) {

    function getPublishDate(date: Date) {
        const month = date.toLocaleString('en', { month: 'short' });
        const day = date.getDate();
        return `${month} ${day}`;
    }

    function ArticleButton({ children }: { children: React.ReactNode }) {
        return (
            <button className="btn btn-ghost btn-sm pl-0.5 gap-0.5 font-light">
                {children}
            </button>
        );
    }

    return (
        <li className="list-row min-h-64">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 flex flex-col justify-between">
                    <div className="flex flex-row items-center text-sm gap-1">
                        <Avatar imageUrl={article.authorAvatar} username={article.authorName} size="sm" />
                        <span className="ml-1.5">{article.authorName}</span>
                        <span>·</span>
                        <span className="text-gray-500">{getPublishDate(new Date(article.publishTime))}</span>
                    </div>
                    {/* article */}
                    <div>
                        <p className="text-xl md:text-2xl font-sans font-bold text-wrap mb-2.5">
                            {article.title}
                        </p>
                        <p className="text-sm text-gray-500 md:text-base font-sans font-light text-wrap">
                            {article.subtitle}
                        </p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div>
                            <div className="lg:tooltip" data-tip="3K claps">
                                <ArticleButton>
                                    <HandsClappingIcon weight="fill" size={20} color="#676565" />
                                    3K
                                </ArticleButton>
                            </div>
                            <div className="lg:tooltip text-sm" data-tip="90 responses">
                                <ArticleButton>
                                    <ChatCircleDotsIcon weight="fill" size={20} color="#676565" />
                                    90
                                </ArticleButton>
                            </div>
                            <div className="lg:tooltip" data-tip="20 reposts">
                                <ArticleButton>
                                    <RepeatIcon size={20} color="#676565" weight="light" />
                                    20
                                </ArticleButton>
                            </div>
                        </div>
                        <div>
                            <div className="lg:tooltip" data-tip="I'm not interested in this story">
                                <button className="btn btn-square btn-ghost">
                                    <ThumbsDownIcon size={24} color="#676565" weight="light" />
                                </button>
                            </div>
                            <div className="lg:tooltip" data-tip="Save">
                                <button className="btn btn-square btn-ghost">
                                    <BookmarkIcon size={24} color="#676565" weight="light" />
                                </button>
                            </div>
                            <div className="lg:tooltip" data-tip="More">
                                <button className="btn btn-square btn-ghost">
                                    <DotsThreeIcon size={24} color="#676565" weight="bold" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content-center">
                    <img src={article.coverImage} alt="cover image of article" />
                </div>
            </div>
        </li >
    );
}