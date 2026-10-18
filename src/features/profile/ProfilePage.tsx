import Avatar from "@/ui/Avatar";
import { Link } from "@tanstack/react-router";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { Route as profileTabRoute } from "@/routes/_app/_protected/profile/$userId/_profile/route";
import Loading from "@/ui/Loading";
import { handleShareCopyLink } from "@/utils/copyHelper";
import CurrentUser from "@/ui/utils/CurrentUser";
import FollowStats from "../follow/FollowStats";
import FollowButton from "../follow/FollowButton";
import ProfileTab from "./ProfileTab";
import { useUserViewerEdge } from "../follow/follow";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import Show from "./Show";
import { useUserProfileContainer } from "./profile";

export default function ProfilePage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  const { userId } = profileTabRoute.useParams();
  const {
    data: userInfo,
    error: userProfileError,
    status: userProfileStatus,
  } = useUserProfileContainer(userId);

  const currentUser = useAtomValue(userAtom);
  const isOwnProfile = currentUser?.id === userId;

  const url = `${window.location.origin}/profile/${userId}`;

  // isFollowing
  const { userViewerEdge, userViewerEdgeStatus } = useUserViewerEdge(
    userId,
    !isOwnProfile,
  );
  const isFollowing = userViewerEdge?.user?.viewerEdge.isFollowing ?? false;

  if (userProfileStatus === "pending") {
    return <Loading />;
  }
  if (userProfileStatus === "error") {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="text-3xl text-red-600">{userProfileError.message}</div>
      </main>
    );
  }

  return (
    // grid layout
    <div className="w-full min-h-dvh grid grid-cols-1 lg:grid-cols-3">
      {/* left main layout */}
      <div className="col-span-1 px-2 lg:px-0 lg:col-span-2 border-r border-base-300">
        {/* flex-col layout */}
        <div className="w-full lg:w-5/6 mx-auto flex flex-col items-center">
          <div className="flex w-full justify-between px-2 lg:p-0">
            {/* user info */}
            <div className="flex py-5 gap-3 lg:px-2">
              <div className="inline-flex lg:hidden">
                <Avatar
                  imageUrl={userInfo.avatar}
                  username={userInfo.username}
                />
              </div>
              <div className="flex flex-col justify-start">
                <div className="w-full text-xl lg:text-4xl lg:my-4 font-bold">
                  {userInfo.username}
                </div>
                <div className="lg:hidden">
                  <FollowStats
                    userId={userId}
                    followerCount={userInfo.socialStats.followerCount}
                    type="followers"
                    className="text-base-content/60"
                  />
                </div>
              </div>
            </div>
            {/* 'more' button */}
            <div className="flex items-center px-0">
              <button
                className="btn btn-square btn-ghost"
                popoverTarget="popover-profile-more"
                style={{ anchorName: "--anchor-1" }}
              >
                <DotsThreeIcon size={24} weight="bold" />
              </button>
              <ul
                className="dropdown dropdown-end menu w-42 bg-base-100 shadow-lg"
                popover="auto"
                id="popover-profile-more"
                style={{ positionAnchor: "--anchor-1" }}
              >
                <li>
                  <button
                    className="btn btn-ghost justify-start text-xs"
                    onClick={() => handleShareCopyLink(url)}
                  >
                    {t("profile.menu.copyLink")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/* 'follow' button (show in small screen) */}
          <CurrentUser
            authorId={userId}
            fallback={
              userViewerEdgeStatus === "success" && (
                <div className="inline-flex lg:hidden mb-3 w-full">
                  <FollowButton
                    userId={userId}
                    currentUserId={currentUser?.id ?? ""}
                    btnStyle="mx-auto w-11/12"
                    isFollowing={isFollowing}
                    followBtnStyle="special"
                  />
                </div>
              )
            }
          />
          {/* profile menu */}
          <ProfileTab />
          {/* outlet */}
          <div className="w-full px-2 md:px-0">{children}</div>
        </div>
      </div>
      {/* right lg-screen-show profile info */}
      <div className="hidden lg:inline-flex sticky top-0 self-start col-span-1 flex-col items-start p-10 gap-3">
        <Show />
        <Avatar
          imageUrl={userInfo.avatar}
          username={userInfo.username}
          size="xl"
        />
        <p className="font-medium text-md">{userInfo.username}</p>
        <FollowStats
          userId={userId}
          followerCount={userInfo.socialStats.followerCount}
          type="followers"
          className="text-base-content/60"
        />
        {/* link to profile edit page */}
        <CurrentUser authorId={userId}>
          <Link
            to="/me/settings"
            className="text-success/75 hover:text-success"
          >
            {t("profile.editProfile")}
          </Link>
        </CurrentUser>
        {/* 'follow' button */}
        <CurrentUser
          authorId={userId}
          fallback={
            userViewerEdgeStatus === "success" && (
              <div className="mt-2">
                <FollowButton
                  userId={userId}
                  currentUserId={currentUser?.id ?? ""}
                  isFollowing={isFollowing}
                  followBtnStyle="special"
                />
              </div>
            )
          }
        />
      </div>
    </div>
  );
}
