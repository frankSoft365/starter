import { formatMonthYear } from "@/utils/dateHelper";
import FollowStats from "../follow/FollowStats";
import { useTranslation } from "react-i18next";
import { Route as profileAboutRoute } from "@/routes/_app/_protected/profile/$userId/_profile/about";
import { useUserAbout } from "./profile";
import type { Membership } from "@/types/user";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";
import { useState } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { en, zh } from "@blocknote/core/locales";
import { uploadFile } from "../editor/editor";
import { ABOUT_EDITOR_INIT } from "@/constants/draft";
import AboutEditorArea from "./AboutEditorArea";
import Loading from "@/ui/Loading";
import Divider from "@/ui/layout/Divider";

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const { userId } = profileAboutRoute.useParams();
  const currentUser = useAtomValue(userAtom);
  const isMyProfile = (currentUser && currentUser.id === userId) ?? false;

  const locale = i18n.resolvedLanguage?.startsWith("zh") ? zh : en;
  const editor = useCreateBlockNote({
    autofocus: "end",
    initialContent: ABOUT_EDITOR_INIT,
    dictionary: {
      ...locale,
      placeholders: {
        ...locale.placeholders,
        default: t("profile.about.placeholder"),
      },
    },
    uploadFile: uploadFile,
  });
  const {
    data: userInfo,
    status: userInfoStatus,
    error,
  } = useUserAbout(userId, editor);

  const [showEditor, setShowEditor] = useState(false);
  const [isFromGetStarted, setIsFromGetStarted] = useState(false);
  // click the 'Get started' button on the card as you has no about
  function GoToEditorAreaFromGetStartedCard() {
    setShowEditor(true);
    setIsFromGetStarted(true);
  }

  // memberSince rendering
  function getMemberSince(membership: Membership) {
    return formatMonthYear(
      new Date(membership.memberSince),
      i18n.resolvedLanguage,
    );
  }

  return (
    <div className="pb-4">
      {userInfoStatus === "pending" && <Loading />}
      {userInfoStatus === "error" && error.message}
      {userInfoStatus === "success" && (
        <div className="w-full bg-base-100">
          {userInfo.about || isFromGetStarted ? (
            <div className="mb-4 mt-2">
              <AboutEditorArea
                userId={userId}
                editor={editor}
                showEditor={showEditor}
                setShowEditor={setShowEditor}
                setIsFromGetStarted={setIsFromGetStarted}
                originalAbout={userInfo.about}
              />
            </div>
          ) : (
            <>
              {isMyProfile ? (
                <div className="mt-8 mb-6 md:mb-10 py-18 px-8 bg-base-200">
                  <div className="md:w-2/3 flex flex-col items-center justify-around gap-4 mx-auto">
                    <p className="text-md font-medium text-center">
                      {t("profile.about.placeholder")}
                    </p>
                    <p className="text-xs text-base-content/90 text-center">
                      {t("profile.about.getStartedDesc")}
                    </p>
                    <button
                      onClick={GoToEditorAreaFromGetStartedCard}
                      className="btn btn-outline mt-2 font-medium rounded-full"
                    >
                      {t("profile.about.getStartedAction")}
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
          {/* divider - show if has about, also show if has 'get started card' */}
          {(userInfo.about || isMyProfile) && <Divider />}
          <div className="mt-8"></div>
          {/* membership and socialStats */}
          <div>
            {/* membership - memberSince */}
            <p className="text-base text-base-content/60">
              {t("profile.memberSince", {
                date: getMemberSince(userInfo.membership),
              })}
            </p>
            {/* socialStats - followerCount and followingCount */}
            <FollowStats
              userId={userInfo.id}
              followerCount={userInfo.socialStats.followerCount}
              followingCount={userInfo.socialStats.followingCount}
              className="text-success my-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}
