import { BookmarkIcon, ChatCircleDotsIcon, DotsThreeIcon, HandsClappingIcon, RepeatIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import type { ArticleListItemVO } from "@/types/article";
import Avatar from "@/ui/Avatar";
import { getPublishDate } from "@/utils/dateHelper";
import ArticleMenuButton from "@/ui/ArticleMenuButton";
import { objectPositionFromRatio } from "@/utils/coverFocus";
import { useTranslation } from "react-i18next";
import { formatLargeNumber } from "@/utils/number";

export default function ArticleListItem({ article }: { article: ArticleListItemVO }) {
    const { t } = useTranslation();

    return (
        <li id={`article-list-item-${article.id}`} className="list-row min-h-64 cursor-pointer grid-cols-5">
            <div className='flex flex-col justify-between col-span-3'>
                <div className="flex flex-row items-center text-sm gap-1">
                    <Avatar imageUrl={article.authorAvatar} username={article.authorName} size="sm" />
                    <span className="ml-1.5">{article.authorName}</span>
                    <span>·</span>
                    <span className="text-gray-500">{getPublishDate(new Date(article.publishTime))}</span>
                </div>
                {/* article */}
                <div>
                    <p className="text-lg md:text-2xl font-sans font-bold text-wrap mb-2.5">
                        {article.title}
                    </p>
                    <p className="text-sm text-gray-500 md:text-base font-sans font-light text-wrap">
                        {article.subtitle}
                    </p>
                </div>
                <div className="flex flex-col lg:flex-row justify-between lg:items-center">
                    <div className="flex flex-row">
                        <div className="lg:tooltip" data-tip={t('btn.clap', { count: article.likeCount })}>
                            <ArticleMenuButton>
                                <HandsClappingIcon weight="fill" size={20} />
                                {formatLargeNumber(article.likeCount)}
                            </ArticleMenuButton>
                        </div>
                        <div className="lg:tooltip" data-tip={t('btn.response', { count: article.responseNum })}>
                            <ArticleMenuButton>
                                <ChatCircleDotsIcon weight="fill" size={20} />
                                {article.responseNum}
                            </ArticleMenuButton>
                        </div>
                        <div className="lg:tooltip" data-tip={t('btn.repost', { count: 20 })}>
                            <ArticleMenuButton>
                                <RepeatIcon size={20} weight="light" />
                                20
                            </ArticleMenuButton>
                        </div>
                    </div>
                    <div className="flex flex-row">
                        <div className="lg:tooltip" data-tip={t('btn.notInterested')}>
                            <button className="btn btn-square btn-ghost mr-2">
                                <ThumbsDownIcon size={24} weight="light" />
                            </button>
                        </div>
                        <div className="lg:tooltip" data-tip={t('btn.favorite')}>
                            <button className="btn btn-square btn-ghost mr-2">
                                <BookmarkIcon size={24} weight="light" />
                            </button>
                        </div>
                        <div className="lg:tooltip" data-tip={t('btn.more')}>
                            <button className="btn btn-square btn-ghost mr-2">
                                <DotsThreeIcon size={24} weight="bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {article.coverImage &&
                <div className="content-center col-start-4 col-end-6">
                    <img
                        src={article.coverImage}
                        alt={t('article.coverAlt')}
                        className="w-full aspect-2/1 object-cover"
                        style={{ objectPosition: objectPositionFromRatio(article.coverFocusY ?? 0.5) }}
                    />
                </div>
            }
        </li >
    );
}