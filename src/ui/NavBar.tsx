import { NotePencilIcon, MagnifyingGlassIcon, ListIcon } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";
import { useAtomValue, useSetAtom } from "jotai";
import AvatarDropdown from "./AvatarDropdown";
import { Route as homeRoute } from "../routes/_app/index";
import { Route as editorRoute } from "../routes/_app/_protected/editor";
import { Route as loginRoute } from "../routes/login";
import { editorEmptySignalAtom, editorSubmissionSignalAtom, editorUpdateSignalAtom, isEditorEmptyAtom } from "../atoms/editor";
import { isLoadingAtom } from "../atoms/user";
import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import { isDirtyAtom } from "@/atoms/article";
import { Route as notificationsRoute } from "@/routes/_app/_protected/me/notifications";
import NotificationBell from "../features/notifications/NotificationBell";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import LanguageBtn from "./LanguageBtn";

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
    const isHomeRoute = location.pathname === homeRoute.to;
    const isEditorRoute = location.pathname === editorRoute.to;
    const isArticleEditRoute = location.pathname.includes(articleEditRoute.to.split('$')[0]);
    const isNotificationRoute = location.pathname === notificationsRoute.to || location.pathname.startsWith(notificationsRoute.to + '/');

    return (
        <div className="navbar bg-base-100 shadow-sm mb-1">
            <div className="navbar-start">
                <label htmlFor="my-drawer-4" className="btn drawer-button btn-square btn-ghost">
                    {/* Sidebar toggle icon */}
                    <ListIcon size={32} />
                </label>
                <button onClick={() => navigate({ to: homeRoute.to })} className="btn btn-ghost btn-sm text-sm mr-2 lg:text-xl lg:btn-md">Aedium</button>
                {/* search input field */}
                {isHomeRoute && <>
                    <input type="text" placeholder={t('nav.searchInput.placeholder')} className="input input-bordered hidden md:inline-flex md:w-56 mr-1" />
                    <button onClick={() => toast.error(t('common.toast.featureNotAvailable'))} className="btn btn-ghost btn-square inline-flex md:hidden mr-1">
                        <MagnifyingGlassIcon size={24} />
                    </button>
                </>}
            </div>
            <div className="navbar-end">
                <LanguageBtn />
                {/* can write only when is login */}
                <SignedIn>
                    {!isEditorRoute && !isArticleEditRoute &&
                        <>
                            <button onClick={() => navigate({ to: editorRoute.to })} className="btn btn-ghost hidden md:inline-flex mr-1">
                                <NotePencilIcon size={24} />
                                {t('btn.write')}
                            </button>
                            <NotificationBell
                                isNotificationRoute={isNotificationRoute}
                                hanleClick={() => navigate({ to: notificationsRoute.to })}
                            />
                        </>
                    }
                    {isEditorRoute && <>
                        <button onClick={() => setEditorPublishSignal(pre => pre + 1)} disabled={isEditorEmpty} className="btn btn-success mr-1 btn-xs lg:btn-md lg:mr-3">
                            {t('btn.publish')}
                        </button>
                        <button onClick={() => setEditorEmptySignal(pre => pre + 1)} disabled={isEditorEmpty} className="btn btn-error mr-2 btn-xs lg:btn-md lg:mr-4">
                            {t('btn.discardDrafts')}
                        </button>
                    </>}
                    {isArticleEditRoute &&
                        <>
                            <button disabled={!isDirty} onClick={() => setEditorUpdateSignal(pre => pre + 1)} className="btn btn-primary mx-4">
                                {t('btn.update')}
                            </button>
                        </>
                    }
                </SignedIn>
                {isLoading && <button className="btn btn-square mr-3">
                    <span className="loading loading-spinner"></span>
                </button>}
                {/* login-button when is not login */}
                {!isLoading && <>
                    <SignedOut>
                        <button onClick={() => navigate({ to: loginRoute.to })} className="btn btn-info btn-sm md:btn-md mr-2 md:mr-4">{t('btn.login')}</button>
                    </SignedOut>
                    {/* user avatar and dropdown */}
                    <SignedIn>
                        <AvatarDropdown />
                    </SignedIn>
                </>}
            </div>
        </div>
    );
}