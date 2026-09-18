import { ListIcon } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Route as homeRoute } from "@/routes/_app/_home/index";
import { Route as HelpCenterHomeRoute } from "@/routes/_protected/hc/index";
import HomeSearch from "./HomeSearch";
import LinkDetailBar from "./LinkDetailBar";

export function HelpCenterLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHelpCenterHomeRoute = location.pathname === HelpCenterHomeRoute.to;

  function linkToHome() {
    navigate({ to: homeRoute.to });
  }

  function linkToHCHome() {
    navigate({ to: HelpCenterHomeRoute.to });
  }
  return (
    <>
      <div className="drawer">
        <input
          id="hc-drawer"
          type="checkbox"
          className="drawer-toggle lg:hidden"
        />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-neutral text-white px-4 md:px-28 w-full">
            <div className="navbar-start">
              <a
                onClick={linkToHCHome}
                className="text-3xl text-white cursor-pointer mr-4"
              >
                Aedium
              </a>
              <span className="hidden md:inline-flex text-sm font-light opacity-85">
                Help Center
              </span>
            </div>
            <div className="navbar-end">
              <div className="flex-none md:hidden">
                <label
                  htmlFor="hc-drawer"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost drawer-button"
                >
                  <ListIcon color="#ffffff" size={24} />
                </label>
              </div>
              <ul className="hidden md:inline-flex menu menu-horizontal px-1">
                <li>
                  <a
                    className="opacity-85 hover:opacity-100"
                    onClick={linkToHome}
                  >
                    Back to home
                  </a>
                </li>
                <li>
                  <a className="btn btn-outline opacity-85 rounded-full border-base-100 text-white hover:opacity-100 hover:bg-neutral">
                    Submit a request
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Page content here */}
          {isHelpCenterHomeRoute ? <HomeSearch /> : <LinkDetailBar />}
          {children}
        </div>
        {/* drawer side */}
        <div className="drawer-side">
          <label
            htmlFor="hc-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <a onClick={linkToHome}>Back to home</a>
            </li>
            <li>
              <a>Submit a request</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
