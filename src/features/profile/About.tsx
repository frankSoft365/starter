import { formatMonthYear } from "@/utils/dateHelper";
import FollowStats from "../follow/FollowStats";
import { useTranslation } from "react-i18next";
import { Route as profileAboutRoute } from "@/routes/_app/_protected/profile/$userId/_profile/about";
import { useUserAbout } from "./profile";
import type { UserInfo } from "@/types/user";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";

function About() {
  const { t, i18n } = useTranslation();
  const { userId } = profileAboutRoute.useParams();
  const currentUser = useAtomValue(userAtom);
  const isMyProfile = (currentUser && currentUser.id === userId) ?? false;
  const { data: userInfo, status: userInfoStatus } = useUserAbout(userId);

  function getMemberSince(userInfo: UserInfo) {
    return formatMonthYear(
      new Date(userInfo.membership.memberSince),
      i18n.resolvedLanguage,
    );
  }

  return (
    <div className="py-8">
      {userInfoStatus === "success" && (
        <div className="w-full lg:w-2xl bg-base-100">
          {/* profile readme */}
          {userInfo.about ? (
            <>
              <div className="p-4 font-serif text-xl">
                Hi! I'm Andy (Andrew when I'm in trouble). I'm a full-time
                writer and a breathwork facilitator. My mission is to write and
                breathe a better world into existence. If you'd like to read
                more of my in-depth work, I wrote a book. It's called The Joy of
                Breathing.
              </div>
              <div className="w-full h-px bg-gray-200 mt-6 md:mt-12 mb-8"></div>
            </>
          ) : isMyProfile ? (
            <>
              <div className="py-18 px-8 bg-base-200">
                <div className="md:w-2/3 flex flex-col items-center justify-around gap-4 mx-auto">
                  <p className="text-md font-medium text-center">
                    Tell the world about yourself
                  </p>
                  <p className="text-xs text-base-content/70 text-center">
                    Here’s where you can share more about yourself: your
                    history, work experience, accomplishments, interests,
                    dreams, and more. You can even add images and use rich text
                    to personalize your bio.
                  </p>
                  <button className="btn btn-outline mt-2 font-medium rounded-full">
                    Get started
                  </button>
                </div>
              </div>
              <div className="w-full h-px bg-gray-200 mt-6 md:mt-12 mb-8"></div>
            </>
          ) : null}

          {/* info of account createAt, num of followers and followings */}
          <div>
            <p className="text-base text-base-content/60">
              {t("profile.memberSince", {
                date: getMemberSince(userInfo),
              })}
            </p>
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

export default About;
