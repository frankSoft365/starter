import BottomMenu from "./BottomMenu";
import DrawerSide from "./DrawerSide";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { useLocation } from "@tanstack/react-router";
import { Route as editorRoute } from "../routes/_app/_protected/editor";
import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";

/**
 * Page-root-layout in addition to the login and registration page
 * @param children your content in root-layout
 * @returns navbar and sidebar and content
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const isEditorRoute = location.pathname === editorRoute.to;
    const isArticleEditRoute = location.pathname.includes(articleEditRoute.to.split('$')[0]);

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <NavBar />
                {/* Page content here */}
                {children}
                {!isEditorRoute && !isArticleEditRoute && <Footer />}
            </div>
            <DrawerSide />
            <BottomMenu />
        </div>
    );
}