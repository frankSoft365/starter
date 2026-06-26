import { Route as articleRoute } from "../routes/_app/article.$articleId";
import Loading from "./Loading";
import Avatar from "./Avatar";
import { getPublishDate } from "../utils/dateHelper";
import EditorComponent from "./EditorComponent";
import { BookmarkIcon, ChatCircleDotsIcon, DotsThreeIcon, ExportIcon, HandsClappingIcon, RepeatIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import ArticleMenuButton from "./ArticleMenuButton";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import { useNavigate } from "@tanstack/react-router";
import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import { useCurrentArticle } from "./article";
import { useCreateBlockNote } from "@blocknote/react";

export default function Article() {
    const navigate = useNavigate();
    const { articleId } = articleRoute.useParams();
    const user = useAtomValue(userAtom);
    const editor = useCreateBlockNote();

    const { article, isLoading } = useCurrentArticle(articleId, editor);

    const isOwnStory = article?.authorId === user?.id;
    const meneButtonColor = isOwnStory ? "#adadad" : "#676565";

    return (
        <>
            {isLoading && <Loading />}
            {!isLoading && article && <>
                <div className="flex flex-col items-center w-3xl mx-auto">
                    <h1 className="text-center font-sans font-bold text-5xl m-6">{article.title}</h1>
                    <div className="flex flex-row items-center text-sm gap-1">
                        <Avatar imageUrl={article.authorAvatar} username={article.authorName} size="sm" />
                        <span className="ml-1.5">{article.authorName}</span>
                        <span>·</span>
                        <span className="text-gray-500">{getPublishDate(new Date(article.publishTime))}</span>
                    </div>
                    <div className="divider mb-0"></div>
                    <div className="flex flex-row items-center justify-around w-full">
                        <div>
                            <div className="lg:tooltip mx-2" data-tip={isOwnStory ? 'Your cannot applaud your own story' : "3K claps"}>
                                <ArticleMenuButton disable={isOwnStory}>
                                    <HandsClappingIcon size={24} color={meneButtonColor} weight="light" />
                                    {!isOwnStory && '3K'}
                                </ArticleMenuButton>
                            </div>
                            <div className="lg:tooltip mx-2" data-tip="Respond">
                                <ArticleMenuButton>
                                    <ChatCircleDotsIcon size={24} color="#676565" weight="light" />
                                    {!isOwnStory && '90'}
                                </ArticleMenuButton>
                            </div>
                            <div className="lg:tooltip mx-2" data-tip={isOwnStory ? 'Your cannot repost your own story' : "20 reposts"}>
                                <ArticleMenuButton disable={isOwnStory}>
                                    <RepeatIcon size={24} color={meneButtonColor} weight="light" />
                                    {!isOwnStory && '20'}
                                </ArticleMenuButton>
                            </div>
                        </div>
                        <div>
                            <div className="lg:tooltip mx-2" data-tip="Save">
                                <button className="btn btn-square btn-ghost">
                                    <BookmarkIcon size={24} color="#676565" weight="light" />
                                </button>
                            </div>
                            <div className="lg:tooltip mx-2" data-tip="Share">
                                <button className="btn btn-square btn-ghost">
                                    <ExportIcon size={24} color="#676565" weight="light" />
                                </button>
                            </div>
                            <div className="lg:tooltip mx-2" data-tip="More">
                                <button className="btn btn-square btn-ghost" popoverTarget="popover-1" style={{ anchorName: "--anchor-1" }} >
                                    <DotsThreeIcon size={24} color="#676565" weight="bold" />
                                </button>
                                <ul className="dropdown menu w-52 bg-base-100 shadow-lg"
                                    popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" }}>
                                    {!isOwnStory && <li>
                                        <button className="btn btn-ghost justify-start">
                                            <ThumbsDownIcon size={24} color="#676565" weight="light" />
                                            Show less like this
                                        </button>
                                    </li>}
                                    {isOwnStory && <li>
                                        <button onClick={() => navigate({ to: articleEditRoute.to, params: { articleId: article.id } })} className="btn btn-ghost justify-start">
                                            Edit story
                                        </button>
                                    </li>}
                                    {!isOwnStory && <li><button className="btn btn-ghost justify-start">
                                        Follow author
                                    </button></li>}
                                    {!isOwnStory && <li><button className="btn btn-ghost justify-start text-red-600">
                                        Report story...
                                    </button></li>}
                                    {isOwnStory && <li>
                                        <button className="btn btn-ghost justify-start text-red-600">
                                            Delete story
                                        </button>
                                    </li>}
                                </ul>

                            </div>

                        </div>
                    </div>
                    <div className="divider mt-0"></div>
                </div>
                <EditorComponent
                    editor={editor}
                    editable={false}
                />
            </>}
        </>
    );
}