import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import Loading from "@/ui/Loading";
import EditorComponent from "@/ui/EditorComponent";
import { BookmarkIcon, HandsClappingIcon } from "@phosphor-icons/react";
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
import type { ArticleResult, ArticleVO, OperationList } from "@/types/article";
import type { BlockNoteEditor } from "@blocknote/core";
import { useRepostState } from "../repost/repost";
import RepostButton from "../repost/RepostButton";
import CommentButton from "./CommentButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { batchQueryCountOrViewerEdge } from "@/services/apiArticle";

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

  const articleIds = [article.id];

  const queryClient = useQueryClient();
  const operationList: OperationList["operationList"] = articleIds.flatMap(
    (articleId) => [
      { operationName: "RepostCountQuery", articleId },
      { operationName: "CollectionBaseQuery", articleId },
    ],
  );
  const { status: articleResultStatus } = useQuery({
    queryKey: ["batch-query-count-or-viewer-edge", articleIds],
    queryFn: async () => {
      const results = await batchQueryCountOrViewerEdge({
        params: { operationList },
      });
      const resultsByArticleId = new Map<string, ArticleResult>();

      for (const result of results) {
        const previous = resultsByArticleId.get(result.id);
        resultsByArticleId.set(result.id, {
          id: result.id,
          repostCount: result.repostCount ?? previous?.repostCount,
          viewerEdge: result.viewerEdge ?? previous?.viewerEdge,
        });
      }
      queryClient.setQueryData(
        ["get-article", article.id],
        (old: { title: string; article: ArticleVO }) => {
          const newArticle = {
            ...article,
            isCollected:
              resultsByArticleId.get(article.id)?.viewerEdge
                ?.collectionsConnection.hasCollected ?? false,
          };
          return {
            ...old,
            article: newArticle,
          };
        },
      );
      return resultsByArticleId;
    },
  });

  return (
    <>
      <div className="w-11/12 lg:w-6/11 mx-auto">
        <div className="flex flex-col items-center w-full">
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
            <h1 className="font-sans font-bold text-3xl/10 lg:text-5xl my-6">
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
          <div className="w-full my-6">
            <div className="w-full h-px bg-gray-200 my-1"></div>
            <div className="flex flex-row items-center justify-between px-1 w-full">
              {/* left buttons */}
              <div className="flex items-center gap-6">
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
              <div className="flex flex-row gap-4">
                {/* save button */}
                {articleResultStatus === "pending" && (
                  <button
                    type="button"
                    className="btn btn-square btn-ghost opacity-60"
                    disabled={true}
                  >
                    <BookmarkIcon size={24} />
                  </button>
                )}
                {articleResultStatus === "success" && (
                  <SaveButton
                    articleId={article.id}
                    initialIsCollected={article.isCollected ?? false}
                  />
                )}
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
            <div className="w-full h-px bg-gray-200 my-1"></div>
          </div>
          {/* editor */}
          <div className="w-full">
            <EditorComponent editor={editor} editable={false} />
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200 my-8"></div>
      <div className="w-11/12 lg:w-6/11 mx-auto">
        {/* comment area */}
        <SignedOut>
          <div className="w-full mx-auto h-64 bg-base-200 text-xl text-base-content/70 text-center py-24">
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
      </div>
    </>
  );
}
