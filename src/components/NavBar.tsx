import { SidebarIcon, NotePencilIcon } from "@phosphor-icons/react";
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

export default function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const setEditorEmptySignal = useSetAtom(editorEmptySignalAtom);
    const setEditorPublishSignal = useSetAtom(editorSubmissionSignalAtom);
    const setEditorUpdateSignal = useSetAtom(editorUpdateSignalAtom);

    const isLoading = useAtomValue(isLoadingAtom);

    const isEditorEmpty = useAtomValue(isEditorEmptyAtom);

    // derived state
    const isEditorRoute = location.pathname === editorRoute.to;
    const isArticleEditRoute = location.pathname.includes(articleEditRoute.to.split('$')[0]);

    return (
        <div className="max-lg:collapse bg-base-200 shadow-sm w-full rounded-md">
            <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
            <label htmlFor="navbar-1-toggle" className="fixed inset-0 hidden max-lg:peer-checked:block"></label>
            <div className="collapse-title navbar">
                <div className="navbar-start">
                    <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        {/* Sidebar toggle icon */}
                        <SidebarIcon size={32} />
                    </label>
                    <button onClick={() => navigate({ to: homeRoute.to })} className="btn btn-ghost text-xl mr-2">Aedium</button>
                    {/* search input field */}
                    <input type="text" placeholder="Search" className="input input-bordered w-36 lg:w-auto mr-2" />
                </div>
                <div className="navbar-end">
                    {/* can write only when is login */}
                    <SignedIn>
                        {!isEditorRoute && !isArticleEditRoute && <button onClick={() => navigate({ to: editorRoute.to })} className="btn btn-ghost hidden md:inline-flex mr-2">
                            <NotePencilIcon size={24} />
                            Write
                        </button>}
                        {isEditorRoute && <>
                            <button onClick={() => setEditorPublishSignal(pre => pre + 1)} disabled={isEditorEmpty} className="btn btn-success mr-4">
                                Publish
                            </button>
                            <button onClick={() => setEditorEmptySignal(pre => pre + 1)} disabled={isEditorEmpty} className="btn btn-error mr-4">
                                Discard drafts
                            </button>
                        </>}
                        {isArticleEditRoute && <button onClick={() => setEditorUpdateSignal(pre => pre + 1)} className="btn btn-primary mr-4">
                            Update
                        </button>}
                    </SignedIn>
                    {isLoading && <button className="btn btn-square mr-3">
                        <span className="loading loading-spinner"></span>
                    </button>}
                    {/* login-button when is not login */}
                    {!isLoading && <>
                        <SignedOut>
                            <button onClick={() => navigate({ to: loginRoute.to })} className="btn btn-info btn-sm lg:btn-md mr-4">Login</button>
                        </SignedOut>
                        {/* user avatar and dropdown */}
                        <SignedIn>
                            <AvatarDropdown />
                        </SignedIn>
                    </>}
                </div>
            </div>
        </div>
    );
}