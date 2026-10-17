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
import type {
  ArticleDetail,
  ArticleResult,
  OperationList,
} from "@/types/article";
import type { BlockNoteEditor } from "@blocknote/core";
import { useRepostState } from "../repost/repost";
import RepostButton from "../repost/RepostButton";
import CommentButton from "./CommentButton";
import { useQuery } from "@tanstack/react-query";
import { batchOperationRequest } from "@/services/apiArticle";
import { useUserViewerEdge } from "../follow/follow";

export default function ArticleDetailPage() {
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
  article: ArticleDetail;
  title: string;
  editor: BlockNoteEditor;
}) {
  const { t } = useTranslation();
  const user = useAtomValue(userAtom);
  const isOwnStory = article.creator.id === user?.id;
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

  const operationList: OperationList["operationList"] = articleIds.flatMap(
    (articleId) => [{ operationName: "CollectionBaseQuery", id: articleId }],
  );
  const { data, status: articleResultStatus } = useQuery({
    queryKey: ["batch-query-count-or-viewer-edge", articleIds],
    queryFn: async () => {
      const results = await batchOperationRequest({
        params: { operationList },
      });
      const resultsByArticleId = new Map<string, ArticleResult>();

      for (const result of results) {
        if (!result.articleResult) {
          continue;
        }
        const articleResult = result.articleResult;
        const previous = resultsByArticleId.get(articleResult.id);
        resultsByArticleId.set(articleResult.id, {
          id: articleResult.id,
          repostCount: articleResult.repostCount ?? previous?.repostCount,
          viewerEdge: articleResult.viewerEdge ?? previous?.viewerEdge,
        });
      }
      return resultsByArticleId;
    },
  });

  // isFollowing
  const { userViewerEdge, userViewerEdgeStatus } = useUserViewerEdge(
    article.creator.id,
    !isOwnStory,
  );
  const isFollowing = userViewerEdge?.user?.viewerEdge.isFollowing ?? false;

  const isCollected =
    data?.get(article.id)?.viewerEdge?.collectionsConnection.hasCollected ??
    false;

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
            <div className="flex items-center gap-4">
              {/* Author info */}
              <ArticleAuthorInfo
                authorId={article.creator.id}
                authorAvatar={article.creator.avatar ?? ""}
                authorName={article.creator.username}
                publishTime={article.publishAt}
                className="text-sm"
              />
              {/* 'follow' button */}
              <SignedIn>
                <CurrentUser
                  authorId={article.creator.id}
                  fallback={
                    userViewerEdgeStatus === "success" && (
                      <FollowButton
                        userId={article.creator.id}
                        currentUserId={user?.id ?? ""}
                        btnStyle="btn-sm"
                        isFollowing={isFollowing}
                      />
                    )
                  }
                />
              </SignedIn>
            </div>
          </div>
          {/* Interaction Bar */}
          <div className="w-full my-6">
            <div className="w-full h-px bg-gray-200 my-1"></div>
            <div className="flex flex-row items-center justify-between px-1 w-full">
              {/* left buttons */}
              <div className="flex items-center gap-4 md:gap-6">
                <div
                  className="lg:tooltip"
                  data-tip={
                    isOwnStory
                      ? t("btn.clapIsOwn")
                      : t("btn.clap", { count: article.clapCount })
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
                    {!isOwnStory && article.clapCount}
                  </button>
                </div>
                {/* comment button */}
                <CommentButton
                  scrollToComments={scrollToComments}
                  responseNum={article.responseCount}
                />
                {/* repost button */}
                {repostStateStatus === "success" ? (
                  <RepostButton article={article} repostState={repostState} />
                ) : (
                  <div className="skeleton h-6 w-8"></div>
                )}
              </div>
              {/* right buttons */}
              <div className="flex flex-row gap-2 md:gap-4">
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
                    isCollected={isCollected}
                  />
                )}
                {/* share button */}
                <ShareButton articleId={article.id} title={title} />
                {/* more button */}
                <MoreButton
                  isOwnStory={isOwnStory}
                  authorId={article.creator.id}
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
          <CommentPublishInput article={article} commentRef={commentRef} />
          {/* comment list */}
          <CommentList articleId={article.id} authorId={article.creator.id} />
        </SignedIn>
      </div>
    </>
  );
}
