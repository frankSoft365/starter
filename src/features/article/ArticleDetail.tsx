import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import Loading from "@/ui/Loading";
import Avatar from "@/ui/Avatar";
import EditorComponent from "@/ui/EditorComponent";
import { ChatCircleDotsIcon, HandsClappingIcon, RepeatIcon } from "@phosphor-icons/react";
import ArticleMenuButton from "@/ui/ArticleMenuButton";
import { useAtomValue } from "jotai";
import { userAtom, isLoginAtom } from "@/atoms/user";
import { useRef, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { useCreateBlockNote } from "@blocknote/react";
import { useCurrentArticle, useLikeStatus, useLikeArticle } from "./article";
import FieldInfo from "@/ui/FieldInfo";
import SignedIn from "@/ui/SignedIn";
import SignedOut from "@/ui/SignedOut";
import { CreateCommentSchema, type CreateCommentForm } from "@/schemas/comment";
import { useAddComment } from "../comment/comment";
import CommentList from "../comment/CommentList";
import ShareButton from "./ShareButton";
import { useTranslation } from "react-i18next";
import DeleteArticleModal from "./DeleteArticleModal";
import MoreButton from "./MoreButton";
import SaveButton from "./SaveButton";
import { TopicShow } from "@/ui/Topic";
import ArticleAuthorInfo from "@/ui/ArticleAuthorInfo";

export default function ArticleDetail() {
    const { t } = useTranslation();
    const { articleId } = articleRoute.useParams();
    const user = useAtomValue(userAtom);
    const editor = useCreateBlockNote();

    const { processedArticle, isLoading, isError, error } = useCurrentArticle(articleId, editor);

    const isLogin = useAtomValue(isLoginAtom);
    const { data: isLiked } = useLikeStatus(articleId, isLogin);
    const { toggleLike, isLiking } = useLikeArticle(articleId);

    const article = processedArticle?.article;
    const title = processedArticle?.title;
    const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);

    const isOwnStory = article?.authorId === user?.id;
    const meneButtonColor = isOwnStory ? "#adadad" : "#676565";

    // click to link to comment area
    const commentRef = useRef<HTMLDivElement | null>(null);
    const scrollToComments = () => {
        commentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const {
        handleAddComment,
        isAddingComment
    } = useAddComment(articleId);

    // write your comment form
    const defaultValues: CreateCommentForm = {
        commentContent: ''
    };
    const form = useForm({
        defaultValues,
        onSubmit: ({ value }) => {
            handleAddComment(
                { params: { content: value.commentContent } },
                {
                    onSuccess: () => {
                        form.resetField('commentContent');
                    },
                },
            );
        },
        validators: {
            onChange: CreateCommentSchema,
            onSubmit: CreateCommentSchema,
        },
    });
    const canSubmit = useStore(form.store, (state) => state.canSubmit);

    return (
        <>
            {isLoading && !isError && <Loading />}
            {isError && <main className="flex items-center justify-center min-h-screen">
                <div className="text-3xl text-red-600">
                    {error?.message || 'Failed to load article content.'}
                </div>
            </main>}
            {!isLoading && !isError && article && <>
                <div className="flex flex-col items-center w-full md:w-3xl mx-auto p-4">
                    <div className="flex flex-col items-start w-full">
                        {/* topics show */}
                        {article.topics.length > 0 &&
                            <div className="mt-6 flex flex-wrap gap-2">{article.topics.map(topicVO => <TopicShow topicContent={topicVO.name} />)}</div>}
                        {/* Title */}
                        <h1 className="font-sans font-bold text-3xl/10 lg:text-5xl/16 my-6">{title}</h1>
                        {/* Author info */}
                        <ArticleAuthorInfo
                            authorId={article.authorId}
                            authorAvatar={article.authorAvatar}
                            authorName={article.authorName}
                            publishTime={article.publishTime}
                            className="text-sm"
                        />
                    </div>
                    {/* Interaction Bar */}
                    <div className="divider mb-0"></div>
                    <div className="flex flex-row items-center justify-around w-full">
                        {/* left buttons */}
                        <div className="flex flex-row">
                            <div className="lg:tooltip mx-1" data-tip={isOwnStory ? t('btn.clapIsOwn') : t('btn.clap', { count: article.likeCount })}>
                                <ArticleMenuButton
                                    type="button"
                                    disable={isOwnStory || isLiking}
                                    onClick={() => toggleLike({ action: isLiked ? 2 : 1 })}
                                >
                                    <HandsClappingIcon size={24} color={isLiked ? '#676565' : meneButtonColor} weight={isLiked ? 'fill' : 'light'} />
                                    {!isOwnStory && article.likeCount}
                                </ArticleMenuButton>
                            </div>
                            <div className="lg:tooltip mx-1" data-tip={t('btn.respond')}>
                                <ArticleMenuButton onClick={scrollToComments} type="button">
                                    <ChatCircleDotsIcon size={24} weight="light" />
                                    {!isOwnStory && article.responseNum}
                                </ArticleMenuButton>
                            </div>
                            <div className="lg:tooltip mx-1" data-tip={isOwnStory ? t('btn.repostIsOwn') : t('btn.repost', { count: 20 })}>
                                <ArticleMenuButton disable={isOwnStory}>
                                    <RepeatIcon size={24} color={meneButtonColor} weight="light" />
                                    {!isOwnStory && '20'}
                                </ArticleMenuButton>
                            </div>
                        </div>
                        {/* right buttons */}
                        <div className="flex flex-row gap-1.5">
                            {/* save button */}
                            <SaveButton articleId={article.id} />
                            {/* share button */}
                            <div className="lg:tooltip" data-tip={t('btn.share')}>
                                <ShareButton articleId={articleId} title={title ?? 'No title'} />
                            </div>
                            {/* more button */}
                            <MoreButton
                                isOwnStory={isOwnStory}
                                authorId={article.authorId}
                                articleId={article.id}
                                onDelete={() => setDeleteArticleId(article.id)}
                            />
                        </div>
                    </div>
                    <div className="divider mt-0"></div>
                    {/* editor */}
                    <div className="w-full -ml-26">
                        <EditorComponent
                            editor={editor}
                            editable={false}
                        />
                    </div>
                </div>
                {/* Delete article Modal */}
                <DeleteArticleModal
                    articleId={deleteArticleId}
                    onClose={() => setDeleteArticleId(null)}
                />
                {/* comment area */}
                <div className="divider mb-0"></div>
                <SignedOut>
                    <div className="w-full lg:w-4xl mx-auto h-48 bg-base-200 text-xl items-center text-center p-6">{t('comment.noAuth')}</div>
                </SignedOut>
                <SignedIn>
                    {/* write your comment */}
                    <div ref={commentRef} className="flex flex-col items-start p-4 w-full lg:w-4xl mx-auto">
                        <h2 className="text-lg md:text-2xl font-bold">{t('comment.response', { count: article.responseNum })}</h2>
                        <div className="flex flex-row items-center text-sm gap-1 my-3">
                            <Avatar imageUrl={user?.image ?? undefined} username={user?.username || ''} size="sm" />
                            <span className="ml-1.5">{user?.username}</span>
                        </div>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }} className="w-full">
                            <form.Field
                                name="commentContent"
                                children={(field) => (
                                    <>
                                        <textarea
                                            placeholder={t('comment.commentInput.placeholder')}
                                            className="textarea w-full textarea-md lg:textarea-lg xl:textarea-xl"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                        <FieldInfo field={field} />
                                    </>
                                )}
                            />
                            <div className="w-full flex">
                                <button
                                    disabled={!canSubmit || isAddingComment}
                                    type="submit"
                                    className="btn btn-sm md:btn-base btn-neutral rounded-full my-3 ml-auto"
                                >
                                    {isAddingComment ? <span className="loading loading-spinner"></span> : t('btn.publish')}
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* comment list */}
                    <CommentList articleId={articleId} authorId={article.authorId} />
                </SignedIn>

            </>}
        </>
    );
}
