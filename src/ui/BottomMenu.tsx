import { HouseIcon, NotePencilIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import SignedIn from "./SignedIn";
import { Route as editorRoute } from "../routes/_app/_protected/editor";
import { Route as homeRoute } from "../routes/_app/index";
import { Route as profileRoute } from "../routes/_app/_protected/_profile/@";

export default function BottomMenu() {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-start pb-4 pl-2 lg:hidden">
            <ul className="menu menu-horizontal px-4 bg-base-200 border-2 border-base-300 gap-3 shadow-xl rounded-full">
                <SignedIn>
                    <li>
                        <button className="btn btn-ghost btn-square" onClick={() => navigate({ to: editorRoute.to })}>
                            <NotePencilIcon size={28} color="#655ae7" />
                        </button>
                    </li>
                </SignedIn>
                <li>
                    <button className="btn btn-ghost btn-square" onClick={() => navigate({ to: homeRoute.to })}>
                        <HouseIcon size={28} />
                    </button>
                </li>
                <li>
                    <button className="btn btn-ghost btn-square" onClick={() => navigate({ to: profileRoute.to })}>
                        <UserCircleIcon size={28} />
                    </button>
                </li>
            </ul>
        </div>
    );
}
