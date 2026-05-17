import { SidebarIcon, NotePencilIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";
import { useAtomValue } from "jotai";
import { userAtom } from "../stores/user";
import AvatarDropdown from "./AvatarDropdown";
import { Route as homeRoute } from "../routes/index";
import { Route as editorRoute } from "../routes/editor";
import { Route as loginRoute } from "../routes/login";

export default function NavBar() {
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
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
                        <button onClick={() => navigate({ to: editorRoute.to })} className="btn btn-ghost hidden md:inline-flex mr-2">
                            <NotePencilIcon size={24} />
                            Write
                        </button>
                    </SignedIn>
                    {/* login-button when is not login */}
                    <SignedOut>
                        <button onClick={() => navigate({ to: loginRoute.to })} className="btn btn-info btn-sm lg:btn-md mr-4">Login</button>
                    </SignedOut>
                    {/* user avatar and dropdown */}
                    <SignedIn>
                        <AvatarDropdown user={user} />
                    </SignedIn>
                </div>
            </div>
        </div>
    );
}