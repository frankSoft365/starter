import { userAtom } from "@/atoms/user";
import { useProfile } from "@/features/account/userProfile";
import { useFollowAction, useUserViewerEdge } from "@/features/follow/follow";
import { Route as profileRoute } from "@/routes/_app/_protected/profile/$userId/_profile/index";
import { getPublishDate } from "@/utils/dateHelper";
import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "./Avatar";
import CurrentUser from "./utils/CurrentUser";
import SignedIn from "./utils/SignedIn";
import FollowStats from "@/features/follow/FollowStats";

export default function ArticleAuthorInfo({
  authorId,
  authorName,
  authorAvatar,
  publishTime,
  className = "",
}: {
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  publishTime: Date | string;
  className?: string;
}) {
  return (
    <div className={`flex flex-row items-center gap-2 ${className}`}>
      <UserHoverLink userId={authorId}>
        <Avatar imageUrl={authorAvatar} username={authorName} size="sm" hover />
      </UserHoverLink>
      <div className="flex flex-wrap">
        <UserHoverLink userId={authorId} linkClassName="link link-hover">
          <span>{authorName}</span>
        </UserHoverLink>
        <span className="mx-1">·</span>
        <span className="text-base-content/60">
          {getPublishDate(new Date(publishTime))}
        </span>
      </div>
    </div>
  );
}

function ArticleAuthorDropdown({ authorId }: { authorId: string }) {
  const { t } = useTranslation();
  const currentUser = useAtomValue(userAtom);
  const isOwnProfile = currentUser?.id === authorId;
  const {
    user,
    isUserProfileFetching,
    isLoadingError: isUserProfileError,
  } = useProfile(authorId);
  // isFollowing
  const { userViewerEdge, userViewerEdgeStatus } = useUserViewerEdge(
    authorId,
    !isOwnProfile,
  );
  const isFollowing = userViewerEdge?.user?.viewerEdge.isFollowing ?? false;

  const { toggleFollow } = useFollowAction(authorId, currentUser?.id ?? "");
  const isPending =
    isUserProfileFetching ||
    (!isOwnProfile && userViewerEdgeStatus === "pending");
  const isError =
    isUserProfileError || (!isOwnProfile && userViewerEdgeStatus === "error");

  return (
    <div className="absolute z-50 top-full left-1/2 -translate-x-1/2 pt-2">
      <div className="w-56 min-h-28 rounded-sm bg-base-100 p-4 shadow-xl">
        {isPending ? (
          <div className="flex min-h-20 items-center justify-center">
            <span
              className="loading loading-spinner loading-md"
              aria-label={t("common.loading")}
            ></span>
          </div>
        ) : isError ? (
          <div className="flex min-h-20 flex-col items-center justify-center gap-2">
            <span className="text-sm text-error">{t("common.error")}</span>
          </div>
        ) : (
          user && (
            <>
              {/* avatar */}
              <div className="flex items-start justify-between gap-3">
                <Link to={profileRoute.to} params={{ userId: authorId }}>
                  <Avatar
                    imageUrl={user.image ?? undefined}
                    username={user.username}
                    hover
                  />
                </Link>
                <CurrentUser
                  authorId={authorId}
                  fallback={
                    <button
                      type="button"
                      className="btn btn-sm rounded-full btn-outline"
                      onClick={() => toggleFollow(isFollowing ? 2 : 1)}
                    >
                      {t(isFollowing ? "btn.following" : "btn.follow")}
                    </button>
                  }
                />
              </div>
              {/* username */}
              <Link
                className="link link-hover mt-3 block w-fit font-bold"
                to={profileRoute.to}
                params={{ userId: authorId }}
              >
                {user.username}
              </Link>
              <FollowStats
                userId={authorId}
                followerCount={user.followerCount}
                type="followers"
                className="text-sm text-base-content/65"
              />
            </>
          )
        )}
      </div>
    </div>
  );
}

export function UserHoverLink({
  userId,
  children,
  className = "",
  linkClassName = "",
}: {
  userId: string;
  children: React.ReactNode;
  className?: string;
  linkClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <Link className={linkClassName} to={profileRoute.to} params={{ userId }}>
        {children}
      </Link>
      <SignedIn>
        {isOpen && <ArticleAuthorDropdown authorId={userId} />}
      </SignedIn>
    </div>
  );
}
