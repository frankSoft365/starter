import Avatar from "../../ui/Avatar";
import { toast } from "sonner";
import { useUserProfile } from "./userProfile";
import { useState } from "react";
import SettingsPageUpdateModal from "./SettingsPageUpdateModal";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { Route as mePasswordRoute } from "../../routes/_app/_protected/me/password";
import { useTranslation } from "react-i18next";

export default function SettingsAccount() {
  const { t } = useTranslation();
  const { user, isUserProfileLoading, isLoadingError } = useUserProfile();

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoadingError) {
    toast.error(t("settings.page.fetchError"));
  }

  return (
    <div className="relative w-full">
      <h2 className="text-lg md:text-xl font-medium my-4">
        {t("settings.page.profile")}
      </h2>
      {/* user information show */}
      {(isUserProfileLoading || isLoadingError) && (
        <div className="skeleton rounded-box h-64 my-4"></div>
      )}
      {!isUserProfileLoading && (
        <ul className="list bg-base-100 rounded-box shadow-sm w-full my-4">
          <li className="list-row">
            <div className="text-left">{t("settings.page.email")}</div>
            <div className="text-right">{user?.email}</div>
          </li>
          <li className="list-row">
            <div className="text-left">{t("settings.page.username")}</div>
            <div className="text-right">
              <button
                type="button"
                className="cursor-pointer hover:opacity-70"
                onClick={() => setIsModalOpen(true)}
              >
                {user?.username}
              </button>
            </div>
          </li>
          <li className="list-row">
            <div className="text-left">{t("settings.page.photo")}</div>
            <div className="text-right">
              <button
                type="button"
                className="cursor-pointer"
                aria-label={t("settings.modal.update")}
                onClick={() => setIsModalOpen(true)}
              >
                <Avatar
                  imageUrl={user?.image ?? undefined}
                  username={user?.username || ""}
                  hover
                />
              </button>
            </div>
          </li>
          <li className="list-row">
            {/* update button */}
            <div className="text-left"></div>
            <div className="text-right">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm md:btn-md"
              >
                {t("settings.modal.update")}
              </button>
            </div>
          </li>
        </ul>
      )}
      <p className="text-lg md:text-xl font-medium my-4">
        {t("settings.page.account")}
      </p>
      <div className="my-4">
        <ul className="list bg-base-100 rounded-box shadow-sm w-full">
          <li
            className="list-row hover:bg-base-300 cursor-pointer relative"
            onClick={() => navigate({ to: mePasswordRoute.to })}
          >
            <div className="text-left cursor-pointer">
              {t("settings.page.changePassword")}
            </div>
            <div className="text-right cursor-pointer w-12 absolute right-0">
              <ArrowSquareOutIcon size={24} />
            </div>
          </li>
        </ul>
      </div>
      {/* modal */}
      {isModalOpen && user && (
        <SettingsPageUpdateModal user={user} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
}
