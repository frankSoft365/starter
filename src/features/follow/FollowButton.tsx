import { BellSlashIcon, CaretDownIcon } from "@phosphor-icons/react";
import { useId, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFollowAction } from "./follow";

type FollowButtonProps = {
  userId: string;
  currentUserId: string;
  btnStyle?: string;
  followBtnStyle?: "basic" | "special";
  isFollowing: boolean;
};

export default function FollowButton({
  userId,
  currentUserId,
  btnStyle = "",
  followBtnStyle = "basic",
  isFollowing,
}: FollowButtonProps) {
  const { t } = useTranslation();
  const id = useId().replace(/:/g, "");
  const popoverId = `popover-follow-${id}`;
  const anchorName = `--anchor-follow-${id}`;
  const popoverRef = useRef<HTMLUListElement>(null);
  const { toggleFollow, isFollowPending } = useFollowAction(
    userId,
    currentUserId,
  );

  const style =
    followBtnStyle === "basic"
      ? "btn-outline"
      : isFollowing
        ? "btn-outline"
        : "btn-neutral";

  const handleFollowClick = () => {
    if (isFollowing) {
      return;
    }

    toggleFollow(1, {
      onSuccess: () => {
        popoverRef.current?.showPopover();
      },
    });
  };

  const handleUnfollowClick = () => {
    toggleFollow(2, {
      onSuccess: () => {
        popoverRef.current?.hidePopover();
      },
    });
  };

  return (
    <>
      <button
        type="button"
        className={`btn rounded-full ${style} ${btnStyle}`}
        style={{ anchorName }}
        aria-controls={popoverId}
        popoverTarget={isFollowing ? popoverId : undefined}
        onClick={handleFollowClick}
        disabled={isFollowPending}
      >
        <>
          {t(isFollowing ? "btn.following" : "btn.follow")}
          {isFollowing && <CaretDownIcon size={12} />}
        </>
      </button>
      <ul
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        className="dropdown dropdown-center menu w-40 bg-base-100 shadow-lg"
        style={{ positionAnchor: anchorName }}
      >
        <li>
          <button
            type="button"
            className="text-red-600"
            onClick={handleUnfollowClick}
            disabled={isFollowPending}
          >
            <>
              <BellSlashIcon size={24} />
              {t("btn.unfollow")}
            </>
          </button>
        </li>
      </ul>
    </>
  );
}
