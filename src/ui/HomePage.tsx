import { Route as homeArticleListRoute } from "@/routes/_app/_home";
import { Route as homeFeatureRoute } from "@/routes/_app/_home/feature";
import { useLocation, useNavigate } from "@tanstack/react-router";

export default function HomePage({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomeArticleListRoute = location.pathname === homeArticleListRoute.to;
  const isHomeFeatureRoute = location.pathname === homeFeatureRoute.to;

  return (
    <div className="w-full flex">
      <div className="lg:mx-20 w-2xl">
        {/* The tab */}
        <div
          role="tablist"
          className="mt-4 z-9 bg-base-100 tabs tabs-border sticky top-0"
        >
          <a
            role="tab"
            className={`tab ${isHomeArticleListRoute ? "tab-active" : ""}`}
            onClick={() => navigate({ to: homeArticleListRoute.to })}
          >
            For you
          </a>
          <a
            role="tab"
            className={`tab ${isHomeFeatureRoute ? "tab-active" : ""}`}
            onClick={() => navigate({ to: homeFeatureRoute.to })}
          >
            Activity
            <div className="badge badge-xs bg-base-300 ml-2 badge-neutral badge-outline">
              Beta
            </div>
          </a>
        </div>
        {children}
      </div>
      {/* The right part */}
      <div className="hidden lg:inline-flex lg:grow lg:flex-col lg:p-12 lg:items-start gap-3 lg:border-l-2 lg:border-base-300">
        <div className="avatar">
          <div className="w-24 rounded-xl">
            <img
              alt="Tailwind-CSS-Avatar-component"
              src="https://img.daisyui.com/images/profile/demo/yellingwoman@192.webp"
            />
          </div>
        </div>
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img
              alt="Tailwind-CSS-Avatar-component"
              src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
