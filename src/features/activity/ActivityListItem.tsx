import type { UserActivity } from "@/types/activity";
import Avatar from "@/ui/Avatar";
import { getPublishDate } from "@/utils/dateHelper";
import {
  ChatCircleIcon,
  HandsClappingIcon,
  ImageIcon,
} from "@phosphor-icons/react";
import ArticlePreviewImage from "../home/ArticlePreviewImage";
import useOverflowHelper from "@/utils/overflowHelper";
import { UserHoverLink } from "@/ui/ArticleAuthorInfo";
import ArticlePreview from "../home/ArticlePreview";
import type { ArticleListItemVO } from "@/types/article";
import { useProfileUser } from "../profile/ProfileUserContext";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Route as articleDetailRoute } from "@/routes/_app/article.$articleId";

export default function ActivityListItem({
  userActivity,
}: {
  userActivity: UserActivity;
}) {
  const { handleOverflow } = useOverflowHelper();
  const user = useProfileUser();
  const navigate = useNavigate();
  const responsePost = userActivity.responsePost;
  const router = useRouter();

  function linkToArticle(articleId: string) {
    navigate({
      to: articleDetailRoute.to,
      params: { articleId: articleId },
    });
  }

  function linkToComment(articleId: string, commentId: string) {
    const hash = `reply${commentId}`;
    const url = router.buildLocation({
      to: articleDetailRoute.to,
      params: { articleId: articleId },
      ...(hash && { hash }),
    }).href;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return userActivity.activityType === "RESPONSE_CREATED" && responsePost ? (
    <li className="list-row grid-cols-1">
      <div className="flex flex-col gap-3">
        {/* the user comment */}
        <div className="flex flex-row items-center justify-start gap-2">
          <Avatar
            imageUrl={responsePost.creator?.avatar ?? ""}
            username={responsePost.creator?.username ?? ""}
            size="xs"
          />
          <div className="text-xs flex flex-row items-center justify-start gap-1 opacity-65">
            <span>{responsePost.creator?.username}</span>
            <ChatCircleIcon size={16} weight="duotone" />
            <span>Responded</span>
            <span>·</span>
            <span>{getPublishDate(new Date(userActivity.occurredAt))}</span>
          </div>
        </div>
        {/* the comment content */}
        <div
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={() =>
            linkToComment(
              userActivity.post.responseRootPost.post.id,
              responsePost.id,
            )
          }
        >
          <div className="mx-2 p-0 divider divider-horizontal"></div>
          <span>{responsePost.content}</span>
        </div>
        {/* the parent comment */}
        {userActivity.post.extendedPreviewContent.isFullContent && (
          <div
            className="flex flex-col gap-2 cursor-pointer"
            onClick={() =>
              linkToComment(
                userActivity.post.responseRootPost.post.id,
                responsePost.id,
              )
            }
          >
            {/* comment author avatar and username */}
            <div className="flex flex-row items-center justify-start gap-2">
              <Avatar
                imageUrl={userActivity.post.creator?.avatar ?? ""}
                username={userActivity.post.creator?.username ?? ""}
                size="xs"
              />
              <UserHoverLink
                userId={userActivity.post.creator?.id ?? ""}
                linkClassName="link link-hover"
              >
                <span className="text-xs">
                  {userActivity.post.creator?.username}
                </span>
              </UserHoverLink>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="mx-2 p-0 divider divider-horizontal"></div>
              <span>{userActivity.post.content}</span>
            </div>
          </div>
        )}
        {/* the relative article */}
        <div
          className="w-4/5 border border-base-300 my-2 p-2 flex flex-row gap-4 items-center cursor-pointer"
          onClick={() =>
            linkToComment(
              userActivity.post.responseRootPost.post.id,
              responsePost.id,
            )
          }
        >
          {/* article preview image */}
          <div className="w-1/10">
            {userActivity.post.responseRootPost.post.previewImage?.url ? (
              <ArticlePreviewImage
                url={userActivity.post.responseRootPost.post.previewImage?.url}
                coverFocusY={
                  userActivity.post.responseRootPost.post.previewImage
                    ?.coverFocusY ?? 0.5
                }
              />
            ) : (
              <div className="flex justify-center opacity-40 bg-base-300">
                <ImageIcon size={24} weight="duotone" />
              </div>
            )}
          </div>
          {/* article title */}
          <span className="font-bold">
            {handleOverflow(userActivity.post.responseRootPost.post.title, 75)}
          </span>
        </div>
      </div>
    </li>
  ) : (
    <li className="list-row grid-cols-1">
      <div className="flex flex-col gap-3">
        {/* the user info */}
        <div className="flex flex-row items-center justify-start gap-2">
          <Avatar
            imageUrl={user?.image ?? ""}
            username={user?.username ?? ""}
            size="xs"
          />
          <div className="text-xs flex flex-row items-center justify-start gap-1 opacity-65">
            <span>{user?.username}</span>
            <HandsClappingIcon size={16} weight="duotone" />
            <span>Clapped</span>
            <span>·</span>
            <span>{getPublishDate(new Date(userActivity.occurredAt))}</span>
          </div>
        </div>

        {/* the relative article (detail info) */}
        {userActivity.post.id ? (
          <div onClick={() => linkToArticle(userActivity.post.id)}>
            <ArticlePreview
              article={
                {
                  id: userActivity.post.id,
                  authorId: userActivity.post.creator?.id ?? "",
                  authorName: userActivity.post.creator?.username ?? "",
                  authorAvatar: userActivity.post.creator?.avatar ?? "",
                  publishTime: userActivity.post.publishAt ?? new Date(),
                  title: userActivity.post.title ?? "",
                  subtitle: !userActivity.post.extendedPreviewContent
                    .isFullContent
                    ? userActivity.post.extendedPreviewContent.subtitle
                    : "",
                  coverImage: userActivity.post.previewImage?.url,
                  coverFocusY:
                    userActivity.post.previewImage?.coverFocusY ?? 0.5,
                  likeCount: userActivity.post.clapCount ?? 0,
                  responseNum: userActivity.post.responseCount ?? 0,
                  repostNum: 20,
                } as ArticleListItemVO
              }
              onDelete={() => {}}
            />
          </div>
        ) : (
          <div className="bg-base-200 text-center p-8">
            <p className="opacity-65">The article is deleted.</p>
          </div>
        )}
      </div>
    </li>
  );
}
