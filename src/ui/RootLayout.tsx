import DrawerSide from "./DrawerSide";
import NavBar from "./NavBar";

/**
 * Page-root-layout in addition to the login and registration page
 * @param children your content in root-layout
 * @returns navbar and sidebar and content
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Navbar */}
                <NavBar />
                {/* Page content here */}
                {children}
            </div>
            <DrawerSide />
        </div>
    );
}