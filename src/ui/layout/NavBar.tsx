import {
  NotePencilIcon,
  MagnifyingGlassIcon,
  ListIcon,
} from "@phosphor-icons/react";
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";
import SignedIn from "../SignedIn";
import SignedOut from "../SignedOut";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import AvatarDropdown from "../AvatarDropdown";
import { Route as homeRoute } from "../../routes/_app/_home/index";
import { Route as editorRoute } from "../../routes/_app/_protected/editor";
import { Route as loginRoute } from "../../routes/login";
import {
  editorEmptySignalAtom,
  editorSubmissionSignalAtom,
  editorUpdateSignalAtom,
  isEditorEmptyAtom,
} from "../../atoms/editor";
import { isLoadingAtom } from "../../atoms/user";
import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import { isDirtyAtom } from "@/atoms/article";
import { Route as notificationsRoute } from "@/routes/_app/_protected/me/notifications";
import NotificationBell from "../../features/notifications/NotificationBell";
import { useTranslation } from "react-i18next";
import { recentSearchesAtom } from "../../atoms/search";
import { useSearchInput } from "../../features/search/search";

export default function NavBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // editor discard publish update work flow
  const setEditorEmptySignal = useSetAtom(editorEmptySignalAtom);
  const setEditorPublishSignal = useSetAtom(editorSubmissionSignalAtom);
  const setEditorUpdateSignal = useSetAtom(editorUpdateSignalAtom);

  // article update
  const isDirty = useAtomValue(isDirtyAtom);

  // user Auth info loading
  const isLoading = useAtomValue(isLoadingAtom);
  // article editor
  const isEditorEmpty = useAtomValue(isEditorEmptyAtom);

  // derived state - route path info
  const isEditorRoute = location.pathname === editorRoute.to;
  const isArticleEditRoute = location.pathname.includes(
    articleEditRoute.to.split("$")[0],
  );
  const isNotificationRoute =
    location.pathname === notificationsRoute.to ||
    location.pathname.startsWith(notificationsRoute.to + "/");

  // search input
  const [recentSearches, setRecentSearches] = useAtom(recentSearchesAtom);
  const { q = "" } = useSearch({
    strict: false,
  });
  const { searchInput, setSearchInput, handleSearch } = useSearchInput(
    q,
    setRecentSearches,
    navigate,
  );

  return (
    <div className="md:z-99 navbar dark:bg-base-200 shadow-xs mb-1">
      <div className="navbar-start">
        <div
          className="md:tooltip md:tooltip-bottom md:tooltip-start md:ml-2"
          data-tip="Close sidebar"
        >
          <label
            htmlFor="my-drawer-4"
            className="btn drawer-button btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <ListIcon size={24} />
          </label>
        </div>
        <span
          onClick={() => navigate({ to: homeRoute.to })}
          className="cursor-pointer font-serif ml-2 mr-6 text-2xl"
        >
          Aedium
        </span>
        {/* search input field */}
        {!isEditorRoute && (
          <>
            <label className="input input-ghost rounded-full bg-base-200 dark:bg-base-300 w-64 hidden md:inline-flex">
              <MagnifyingGlassIcon size={24} />
              <input
                onKeyDown={handleSearch}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("nav.searchInput.placeholder")}
                className="input input-ghost bg-base-200 dark:bg-base-300 md:grow"
                list="resentSearches"
              />
            </label>

            <datalist id="resentSearches">
              {recentSearches.map((recent) => (
                <option key={recent} value={recent}></option>
              ))}
            </datalist>
          </>
        )}
      </div>
      <div className="navbar-end">
        {/* search btn in small screen */}
        {!isEditorRoute && (
          <button
            onClick={() => navigate({ to: "/search" })}
            className="btn btn-ghost btn-square inline-flex md:hidden mr-2"
          >
            <MagnifyingGlassIcon size={24} />
          </button>
        )}
        {/* can write only when is login */}
        <SignedIn>
          {!isEditorRoute && !isArticleEditRoute && (
            <>
              <span
                onClick={() => navigate({ to: editorRoute.to })}
                className="cursor-pointer items-center px-2 font-light text-base-content/65 hover:text-base-content hidden md:inline-flex mr-4"
              >
                <NotePencilIcon size={24} />
                <span className="ml-1 text-sm">{t("btn.write")}</span>
              </span>
              <NotificationBell
                isNotificationRoute={isNotificationRoute}
                hanleClick={() => navigate({ to: notificationsRoute.to })}
              />
            </>
          )}
          {/* article editor */}
          {isEditorRoute && (
            <>
              <button
                onClick={() => setEditorPublishSignal((pre) => pre + 1)}
                disabled={isEditorEmpty}
                className="btn btn-success mr-1 btn-xs lg:btn-md lg:mr-3 rounded-full"
              >
                {t("btn.publish")}
              </button>
              <button
                onClick={() => setEditorEmptySignal((pre) => pre + 1)}
                disabled={isEditorEmpty}
                className="btn btn-error mr-2 btn-xs lg:btn-md lg:mr-4 rounded-full"
              >
                {t("btn.discardDrafts")}
              </button>
            </>
          )}
          {isArticleEditRoute && (
            <>
              <button
                disabled={!isDirty}
                onClick={() => setEditorUpdateSignal((pre) => pre + 1)}
                className="btn btn-primary mx-4 rounded-full"
              >
                {t("btn.update")}
              </button>
            </>
          )}
        </SignedIn>
        {isLoading && (
          <button className="btn btn-square mr-3">
            <span className="loading loading-spinner"></span>
          </button>
        )}
        {/* login-button when is not login */}
        {!isLoading && (
          <>
            <SignedOut>
              <button
                onClick={() => navigate({ to: loginRoute.to })}
                className="btn btn-success btn-sm md:btn-md rounded-full mr-2 md:mr-4"
              >
                {t("btn.login")}
              </button>
            </SignedOut>
            {/* user avatar and dropdown */}
            <SignedIn>
              <AvatarDropdown />
            </SignedIn>
          </>
        )}
      </div>
    </div>
  );
}
