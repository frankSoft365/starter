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
        <div className="mt-4">
          <div role="tablist" className="tabs tabs-border">
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
              Feature
            </a>
          </div>
        </div>
        {children}
      </div>
      {/* The right part */}
      <div className="hidden lg:inline-flex lg:grow lg:flex-col lg:p-12 lg:items-start gap-3 lg:border-l-2 lg:border-base-300">
        <div className="stack w-48">
          <img
            alt="Tailwind CSS example 1"
            src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
            className="rounded-box"
          />
          <img
            alt="Tailwind CSS example 2"
            src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
            className="rounded-box"
          />
          <img
            alt="Tailwind CSS example 3"
            src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
            className="rounded-box"
          />
        </div>
      </div>
    </div>
  );
}
