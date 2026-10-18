import { useNavigate } from "@tanstack/react-router";
import { Route as articleDetailRoute } from "@/routes/_app/article.$articleId";
import { ArrowsClockwiseIcon, HandsClappingIcon } from "@phosphor-icons/react";
import RepostArticlePreview from "./RepostArticlePreview";
import type { RepostListItem, RepostState } from "@/types/repost";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import Avatar from "@/ui/Avatar";
import { getPublishDate } from "@/utils/dateHelper";
import MoreButton from "./MoreButton";
import ShareButton from "../article/ShareButton";

export default function RepostListItem({
  repostListItem,
}: {
  repostListItem: RepostListItem;
}) {
  const navigate = useNavigate();
  const currentUser = useAtomValue(userAtom);

  function linkToArticle(articleId: string) {
    navigate({
      to: articleDetailRoute.to,
      params: { articleId: articleId },
    });
  }

  const repostState: RepostState = {
    userId: repostListItem.repost.user.id,
    articleId: repostListItem.post.id,
    hasReposted: true,
    note: repostListItem.repost.note,
  };

  return (
    <li className="list-row grid-cols-1">
      <div className="flex flex-col gap-3">
        {/* the basic info */}
        <div className="flex items-center text-base-content/65 text-xs md:text-sm">
          {repostListItem.repost.user.id === currentUser?.id ? (
            <span>You</span>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar
                imageUrl={repostListItem.repost.user.avatar}
                username={repostListItem.repost.user.username}
                size="xs"
              />
              <span className="text-sm">
                {repostListItem.repost.user.username}
              </span>
            </div>
          )}

          <div className="mx-1">
            <ArrowsClockwiseIcon size={18} />
          </div>
          <span>reposted</span>
          <span className="mx-1">·</span>
          <span>
            {getPublishDate(new Date(repostListItem.repost.repostedAt))}
          </span>
        </div>
        {/* the article preveiw */}
        {repostListItem.repost.note !== null ? (
          <div className="flex flex-row items-center gap-2">
            <div className="w-6 mx-0 p-0 divider divider-horizontal"></div>
            <div className="w-full flex flex-col">
              <p className="text-sm">{repostListItem.repost.note}</p>
              <div
                className="cursor-pointer md:w-5/6"
                onClick={() => linkToArticle(repostListItem.post.id)}
              >
                <RepostArticlePreview article={repostListItem.post} />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="cursor-pointer md:w-5/6"
            onClick={() => linkToArticle(repostListItem.post.id)}
          >
            <RepostArticlePreview article={repostListItem.post} />
          </div>
        )}

        {/* the action bar */}
        <div className="flex gap-4 items-center">
          <button disabled className="btn btn-ghost px-1.5">
            <HandsClappingIcon size={24} weight="light" />
          </button>
          {/* share button */}
          <ShareButton
            articleId={repostListItem.post.id}
            title={repostListItem.post.title}
          />
          <MoreButton article={repostListItem.post} repostState={repostState} />
        </div>
      </div>
    </li>
  );
}
