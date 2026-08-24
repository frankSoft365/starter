import DrawerSide from "./DrawerSide";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { useLocation } from "@tanstack/react-router";
import { Route as editorRoute } from "../routes/_app/_protected/editor";
import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import { useState } from "react";

/**
 * Page-root-layout in addition to the login and registration page
 * @param children your content in root-layout
 * @returns navbar and sidebar and content
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();
    const isEditorRoute = location.pathname === editorRoute.to;
    const isArticleEditRoute = location.pathname.includes(articleEditRoute.to.split('$')[0]);

    return (
        <>
            {/* Navbar */}
            <NavBar />
            <div className="drawer md:drawer-open">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" checked={drawerOpen} onChange={(e) => setDrawerOpen(e.target.checked)} />
                <div className="drawer-content flex flex-col min-h-dvh">
                    {/* Page content here */}
                    <div className="flex-1">{children}</div>
                    {!isEditorRoute && !isArticleEditRoute && <Footer />}
                </div>
                <DrawerSide onNav={setDrawerOpen} />
            </div>
        </>
    );
}