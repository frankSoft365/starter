import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import Loading from "@/ui/Loading";
import EditorComponent from "@/ui/EditorComponent";
import { HandsClappingIcon } from "@phosphor-icons/react";
import { useAtomValue } from "jotai";
import { userAtom, isLoginAtom } from "@/atoms/user";
import { useCreateBlockNote } from "@blocknote/react";
import { useCurrentArticle, useLikeStatus, useLikeArticle } from "./article";
import SignedIn from "@/ui/utils/SignedIn";
import SignedOut from "@/ui/utils/SignedOut";
import CommentList from "../comment/CommentList";
import ShareButton from "./ShareButton";
import { useTranslation } from "react-i18next";
import MoreButton from "./MoreButton";
import SaveButton from "./SaveButton";
import { TopicShow } from "@/ui/Topic";
import ArticleAuthorInfo from "@/ui/ArticleAuthorInfo";
import CurrentUser from "@/ui/utils/CurrentUser";
import FollowButton from "../follow/FollowButton";
import { useSaveReadingHistory } from "../readingHistory/readingHistory";
import { useCommentAreaScroll } from "./commentScroll";
import CommentPublishInput from "./CommentPublishInput";
import type { ArticleVO } from "@/types/article";
import type { BlockNoteEditor } from "@blocknote/core";
import { useRepostState } from "../repost/repost";
import RepostButton from "../repost/RepostButton";
import CommentButton from "./CommentButton";

export default function ArticleDetail() {
  const { articleId } = articleRoute.useParams();
  const editor = useCreateBlockNote();
  const {
    data: processedArticle,
    error,
    status,
  } = useCurrentArticle(articleId, editor);

  switch (status) {
    case "pending":
      return <Loading />;
    case "error":
      return (
        <main className="flex items-center justify-center min-h-screen">
          <div className="text-3xl text-red-600">
            {error.message || "Failed to load article content."}
          </div>
        </main>
      );
    case "success":
      return (
        <ArticleDetailContent
          article={processedArticle.article}
          title={processedArticle.title}
          editor={editor}
        />
      );
  }
}

function ArticleDetailContent({
  article,
  title,
  editor,
}: {
  article: ArticleVO;
  title: string;
  editor: BlockNoteEditor;
}) {
  const { t } = useTranslation();
  const user = useAtomValue(userAtom);
  const isOwnStory = article?.authorId === user?.id;
  const meneButtonColor = isOwnStory ? "#adadad" : "#676565";

  // reading history save
  useSaveReadingHistory(article.id);

  const isLogin = useAtomValue(isLoginAtom);
  const { data: isLiked } = useLikeStatus(article.id, isLogin);
  const { toggleLike, isLiking } = useLikeArticle(article.id);

  // scroll to comment area
  const { commentRef, scrollToComments } = useCommentAreaScroll();

  // repost feature
  // 查询当前用户是否转发
  const { data: repostState, status: repostStateStatus } = useRepostState(
    article.id,
  );

  return (
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
          <div className="flex items-center gap-4">
            <div
              className="lg:tooltip"
              data-tip={
                isOwnStory
                  ? t("btn.clapIsOwn")
                  : t("btn.clap", { count: article.likeCount })
              }
            >
              <button
                type="button"
                className="btn btn-ghost btn-sm px-0.5 gap-0.5 font-light"
                disabled={isOwnStory || isLiking}
                onClick={() => toggleLike({ action: isLiked ? 2 : 1 })}
              >
                <HandsClappingIcon
                  size={24}
                  color={isLiked ? "#676565" : meneButtonColor}
                  weight={isLiked ? "fill" : "light"}
                />
                {!isOwnStory && article.likeCount}
              </button>
            </div>
            {/* comment button */}
            <CommentButton
              scrollToComments={scrollToComments}
              responseNum={article.responseNum}
            />
            {/* repost button */}
            {repostStateStatus === "success" ? (
              <RepostButton article={article} repostState={repostState} />
            ) : (
              <div className="skeleton h-6 w-8"></div>
            )}
          </div>
          {/* right buttons */}
          <div className="flex flex-row gap-1.5">
            {/* save button */}
            <SaveButton articleId={article.id} />
            {/* share button */}
            <ShareButton articleId={article.id} title={title} />
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
          articleId={article.id}
          article={article}
          commentRef={commentRef}
        />
        {/* comment list */}
        <CommentList articleId={article.id} authorId={article.authorId} />
      </SignedIn>
    </>
  );
}
