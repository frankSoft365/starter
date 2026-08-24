import { BookmarkIcon, ChatCircleDotsIcon, HandsClappingIcon, RepeatIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import type { ArticleListItemVO } from "@/types/article";
import ArticleMenuButton from "@/ui/ArticleMenuButton";
import { objectPositionFromRatio } from "@/utils/coverFocus";
import { useTranslation } from "react-i18next";
import { formatLargeNumber } from "@/utils/number";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import MoreButton from "../article/MoreButton";
import SaveButton from "../article/SaveButton";
import ArticleAuthorInfo from "@/ui/ArticleAuthorInfo";
import SignedIn from "@/ui/SignedIn";
import SignedOut from "@/ui/SignedOut";

export default function ArticleListItem({ article, onDelete, onRemoveFromList }: { article: ArticleListItemVO; onDelete: () => void; onRemoveFromList?: () => void }) {
    const { t } = useTranslation();
    const user = useAtomValue(userAtom);

    const isOwnStory = user ? article.authorId === user.id : false;

    return (
        <li id={`article-list-item-${article.id}`} className="list-row min-h-56 cursor-pointer grid-cols-5 md:grid-cols-7">
            <div className='flex flex-col justify-between col-span-3 md:col-span-5'>
                <ArticleAuthorInfo
                    authorId={article.authorId}
                    authorAvatar={article.authorAvatar}
                    authorName={article.authorName}
                    publishTime={article.publishTime}
                    className="text-xs md:text-sm"
                />
                {/* article content */}
                <div>
                    <p className="text-lg md:text-2xl font-sans font-bold text-wrap mt-1 mb-2.5">
                        {article.title}
                    </p>
                    <p className="text-sm opacity-60 md:text-base font-sans font-light text-wrap">
                        {article.subtitle}
                    </p>
                </div>
                {/* actions */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-center">
                    <div className="flex flex-row">
                        <div className="lg:tooltip" data-tip={t('btn.clap', { count: article.likeCount })}>
                            <ArticleMenuButton>
                                <HandsClappingIcon size={20} />
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
                    <div className="flex flex-row justify-start gap-1">
                        <div className="lg:tooltip" data-tip={t('btn.notInterested')}>
                            <button className="btn btn-square btn-ghost">
                                <ThumbsDownIcon size={24} weight="light" />
                            </button>
                        </div>
                        {/* save button */}
                        <SignedIn>
                            <SaveButton articleId={article.id} />
                        </SignedIn>
                        <SignedOut>
                            <div className="lg:tooltip" data-tip={t('btn.favorite')}>
                                <button type="button" className="btn btn-square btn-ghost" disabled>
                                    <BookmarkIcon size={24} weight="light" />
                                </button>
                            </div>
                        </SignedOut>
                        {/* more button */}
                        <MoreButton isOwnStory={isOwnStory} authorId={article.authorId} articleId={article.id} onDelete={onDelete} onRemoveFromList={onRemoveFromList} />
                    </div>
                </div>
            </div>
            {article.coverImage &&
                <div className="content-center col-start-4 col-end-6 md:col-start-6 md:col-end-8">
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
