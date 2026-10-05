import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import Loading from "@/ui/Loading";
import EditorComponent from "@/ui/EditorComponent";
import {
  ArrowsClockwiseIcon,
  ChatCircleDotsIcon,
  HandsClappingIcon,
  NotePencilIcon,
} from "@phosphor-icons/react";
import ArticleMenuButton from "@/ui/ArticleMenuButton";
import { useAtomValue } from "jotai";
import { userAtom, isLoginAtom } from "@/atoms/user";
import { useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { useCurrentArticle, useLikeStatus, useLikeArticle } from "./article";
import SignedIn from "@/ui/SignedIn";
import SignedOut from "@/ui/SignedOut";
import CommentList from "../comment/CommentList";
import ShareButton from "./ShareButton";
import { useTranslation } from "react-i18next";
import MoreButton from "./MoreButton";
import SaveButton from "./SaveButton";
import { TopicShow } from "@/ui/Topic";
import ArticleAuthorInfo from "@/ui/ArticleAuthorInfo";
import CurrentUser from "@/ui/CurrentUser";
import FollowButton from "../follow/FollowButton";
import { useSaveReadingHistory } from "../readingHistory/readingHistory";
import { useCommentAreaScroll } from "./commentScroll";
import CommentPublishInput from "./CommentPublishInput";

export default function ArticleDetail() {
  const { t } = useTranslation();
  const { articleId } = articleRoute.useParams();
  const user = useAtomValue(userAtom);
  const editor = useCreateBlockNote();

  // scroll to comment area
  const { commentRef, scrollToComments } = useCommentAreaScroll();

  // reading history save
  useSaveReadingHistory(articleId);

  const {
    data: processedArticle,
    isLoading,
    isError,
    error,
  } = useCurrentArticle(articleId, editor);

  const isLogin = useAtomValue(isLoginAtom);
  const { data: isLiked } = useLikeStatus(articleId, isLogin);
  const { toggleLike, isLiking } = useLikeArticle(articleId);

  const article = processedArticle?.article;
  const title = processedArticle?.title;

  const isOwnStory = article?.authorId === user?.id;
  const meneButtonColor = isOwnStory ? "#adadad" : "#676565";

  const [repostState, setRepostState] = useState<
    "idle" | "rotating" | "reposted"
  >("idle");

  return (
    <>
      {isLoading && !isError && <Loading />}
      {isError && (
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-3xl text-red-600">
            {error?.message || "Failed to load article content."}
          </div>
        </main>
      )}
      {!isLoading && !isError && article && (
        <>
          <div className="flex flex-col items-center w-full md:px-32 p-4">
            <div className="flex flex-col items-start w-full">
              {/* topics show */}
              {article.topics.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {article.topics.map((topicVO) => (
                    <TopicShow key={topicVO.id} topicContent={topicVO.name} />
                  ))}
                </div>
              )}
              {/* Title */}
              <h1 className="font-sans font-bold text-3xl/10 lg:text-5xl/16 my-6">
                {title}
              </h1>
              <div className="flex items-center gap-2">
                {/* Author info */}
                <ArticleAuthorInfo
                  authorId={article.authorId}
                  authorAvatar={article.authorAvatar}
                  authorName={article.authorName}
                  publishTime={article.publishTime}
                  className="text-sm"
                />
                {/* 'follow' button */}
                <SignedIn>
                  <CurrentUser
                    authorId={article.authorId}
                    fallback={<FollowButton userId={article.authorId} />}
                  />
                </SignedIn>
              </div>
            </div>
            {/* Interaction Bar */}
            <div className="divider mb-0"></div>
            <div className="flex flex-row items-center justify-around w-full">
              {/* left buttons */}
              <div className="flex flex-row items-center">
                <div
                  className="lg:tooltip mx-1"
                  data-tip={
                    isOwnStory
                      ? t("btn.clapIsOwn")
                      : t("btn.clap", { count: article.likeCount })
                  }
                >
                  <ArticleMenuButton
                    type="button"
                    disable={isOwnStory || isLiking}
                    onClick={() => toggleLike({ action: isLiked ? 2 : 1 })}
                  >
                    <HandsClappingIcon
                      size={24}
                      color={isLiked ? "#676565" : meneButtonColor}
                      weight={isLiked ? "fill" : "light"}
                    />
                    {!isOwnStory && article.likeCount}
                  </ArticleMenuButton>
                </div>
                <div className="lg:tooltip mx-1" data-tip={t("btn.respond")}>
                  <ArticleMenuButton onClick={scrollToComments} type="button">
                    <ChatCircleDotsIcon size={24} weight="light" />
                    {!isOwnStory && article.responseNum}
                  </ArticleMenuButton>
                </div>
                {/* repost */}
                <div className="flex items-center gap-1">
                  <div className="dropdown">
                    <div
                      className="lg:tooltip"
                      data-tip={
                        isOwnStory
                          ? t("btn.repostIsOwn")
                          : t("btn.repost", { count: 20 })
                      }
                    >
                      <div
                        tabIndex={0}
                        role="button"
                        className={`btn p-0 bg-base-100 border-0 ${isOwnStory ? "btn-disabled opacity-60" : ""}`}
                      >
                        <svg
                          viewBox="0 0 256 256"
                          width="24"
                          height="24"
                          fill="none"
                          color={
                            repostState === "reposted"
                              ? undefined
                              : meneButtonColor
                          }
                          className={
                            repostState === "reposted"
                              ? "text-success"
                              : "text-base-content/60 hover:text-base-content"
                          }
                          aria-hidden="true"
                        >
                          <g
                            className={`origin-center transition-transform duration-700 ${repostState === "idle" ? "rotate-0" : "rotate-180"}`}
                            onTransitionEnd={(event) => {
                              if (
                                event.target === event.currentTarget &&
                                (event.propertyName === "rotate" ||
                                  event.propertyName === "transform") &&
                                repostState === "rotating"
                              ) {
                                setRepostState("reposted");
                              }
                            }}
                          >
                            <polyline
                              points="168 96 216 96 216 48"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="16"
                            />
                            <path
                              d="M216 96 187.72 67.72A88 88 0 0 0 64 67"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="16"
                            />
                            <polyline
                              points="88 160 40 160 40 208"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="16"
                            />
                            <path
                              d="M40 160 68.28 188.28A88 88 0 0 0 192 189"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="16"
                            />
                          </g>
                          <path
                            d="M100 128l18 18 38-40"
                            stroke="currentColor"
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-opacity duration-200 ${repostState === "reposted" ? "opacity-100" : "opacity-0"}`}
                          />
                        </svg>
                      </div>
                    </div>

                    <ul
                      tabIndex={0}
                      className="dropdown-content menu z-1 w-52 bg-base-100 p-2 shadow-sm"
                    >
                      <li>
                        <button
                          onClick={(event) => {
                            if (repostState === "idle") {
                              setRepostState("rotating");
                            }
                            event.currentTarget.blur();
                          }}
                        >
                          <ArrowsClockwiseIcon size={24} />
                          Repost
                        </button>
                      </li>
                      <li>
                        <button>
                          <NotePencilIcon size={24} />
                          Repost with a note
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="lg:tooltip" data-tip="hello!">
                    {!isOwnStory && (
                      <span className="text-base-content/60 hover:text-base-content">
                        20
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* right buttons */}
              <div className="flex flex-row gap-1.5">
                {/* save button */}
                <SaveButton articleId={article.id} />
                {/* share button */}
                <div className="lg:tooltip" data-tip={t("btn.share")}>
                  <ShareButton
                    articleId={articleId}
                    title={title ?? "No title"}
                  />
                </div>
                {/* more button */}
                <MoreButton
                  isOwnStory={isOwnStory}
                  authorId={article.authorId}
                  articleId={article.id}
                />
              </div>
            </div>
            <div className="divider mt-0"></div>
            {/* editor */}
            <div className="w-full">
              <EditorComponent editor={editor} editable={false} />
            </div>
          </div>

          <div className="divider mb-0"></div>
          {/* comment area */}
          <SignedOut>
            <div className="w-full lg:w-4xl mx-auto h-48 bg-base-200 text-xl items-center text-center p-6">
              {t("comment.noAuth")}
            </div>
          </SignedOut>
          <SignedIn>
            {/* write your comment */}
            <CommentPublishInput
              articleId={articleId}
              article={article}
              commentRef={commentRef}
            />
            {/* comment list */}
            <CommentList articleId={articleId} authorId={article.authorId} />
          </SignedIn>
        </>
      )}
    </>
  );
}
