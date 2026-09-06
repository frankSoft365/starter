import { Route as searchFirstRoute } from "@/routes/_app/search/_search/route";
import { XIcon } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useRecentSearches, useSearchInput } from "@/features/search/search";
import { useTranslation } from "react-i18next";
import { Route as indexRoute } from "@/routes/_app/search/_search/index";
import { Route as postsRoute } from "@/routes/_app/search/_search/posts";
import { Route as usersRoute } from "@/routes/_app/search/_search/users";
import { Route as publicationsRoute } from "@/routes/_app/search/_search/publications";
import { Route as tagsRoute } from "@/routes/_app/search/_search/tags";
import { Route as listsRoute } from "@/routes/_app/search/_search/lists";

export default function SearchPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { q } = searchFirstRoute.useSearch();

  // recent searches hook
  const { recentSearches, setRecentSearches, handleDeleteRecentSearches } =
    useRecentSearches();

  // search input hook
  const { searchInput, setSearchInput, handleSearch } = useSearchInput(
    q,
    setRecentSearches,
    navigate,
  );

  return (
    <div className="w-full flex">
      <div className="lg:mx-20 w-2xl">
        <div className="px-4 lg:px-0">
          <div className="flex flex-col items-center">
            {/* search input */}
            <input
              type="search"
              onKeyDown={handleSearch}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("nav.searchInput.placeholder")}
              className="input w-11/12 mt-4 rounded-full inline-flex md:hidden"
            />
          </div>
          {q ? (
            <>
              {/* The result declare */}
              <h1 className="text-2xl px-4 lg:text-5xl font-medium my-6">
                <span className="opacity-60">Results for</span> {q}
              </h1>
              {/* <h1 className="text-4xl text-red-500">{location.pathname}</h1>
              <h1 className="text-3xl">{postsRoute.to}</h1>
              <h1 className="text-3xl">{usersRoute.to}</h1>
              <h1 className="text-3xl">{publicationsRoute.to}</h1>
              <h1 className="text-3xl">{tagsRoute.to}</h1>
              <h1 className="text-3xl">{listsRoute.to}</h1> */}
              {/* The tab */}
              <div role="tablist" className="tabs tabs-border">
                <a
                  role="tab"
                  className={`tab ${location.pathname === postsRoute.to || location.pathname === indexRoute.to ? "tab-active" : ""}`}
                  onClick={() => {
                    if (location.pathname === indexRoute.to) {
                      navigate({ to: "/search", search: { q: q } });
                    } else {
                      navigate({ to: "/search/posts", search: { q: q } });
                    }
                  }}
                >
                  Stories
                </a>
                <a
                  role="tab"
                  className={`tab ${location.pathname === usersRoute.to ? "tab-active" : ""}`}
                  onClick={() =>
                    navigate({ to: "/search/users", search: { q: q } })
                  }
                >
                  People
                </a>
                <a
                  role="tab"
                  className={`tab ${location.pathname === publicationsRoute.to ? "tab-active" : ""}`}
                  onClick={() =>
                    navigate({ to: "/search/publications", search: { q: q } })
                  }
                >
                  Publications
                </a>
                <a
                  role="tab"
                  className={`tab ${location.pathname === tagsRoute.to ? "tab-active" : ""}`}
                  onClick={() =>
                    navigate({ to: "/search/tags", search: { q: q } })
                  }
                >
                  Topics
                </a>
                <a
                  role="tab"
                  className={`tab ${location.pathname === listsRoute.to ? "tab-active" : ""}`}
                  onClick={() =>
                    navigate({ to: "/search/lists", search: { q: q } })
                  }
                >
                  Lists
                </a>
              </div>
              {children}
            </>
          ) : (
            <>
              {/* Recent searches title */}
              <h1 className="text-2xl px-4 lg:text-5xl font-medium my-6">
                Recent searches
              </h1>
              {/* recent searches list */}
              {recentSearches.length > 0 ? (
                <ul className="list">
                  {recentSearches.map((item) => {
                    return (
                      <li
                        className="list-row hover:bg-base-200"
                        key={item}
                        onClick={() =>
                          navigate({ to: "/search", search: { q: item } })
                        }
                      >
                        <div className="flex items-center text-md">{item}</div>
                        <div></div>
                        <button
                          className="btn btn-square btn-ghost btn-xs"
                          onClick={(e) => handleDeleteRecentSearches(item, e)}
                        >
                          <XIcon size={16} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="flex items-center justify-center min-h-24">
                  <h1 className="text-xl opacity-70">No rencent searches</h1>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* The right part */}
      <div className="hidden lg:inline-flex lg:grow lg:flex-col lg:p-12 lg:items-start gap-3 lg:border-l-2 lg:border-base-300">
        {q && (
          <div className="aura aura-rainbow">
            <div className="card w-full bg-base-100 shadow-sm">
              <div className="card-body">
                <span className="badge badge-xs badge-warning">
                  Most Popular
                </span>
                <div className="flex justify-between">
                  <h2 className="text-3xl font-bold">Premium</h2>
                  <span className="text-xl">$29/mo</span>
                </div>
                <ul className="mt-6 flex flex-col gap-2 text-xs">
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 me-2 inline-block text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>High-resolution image generation</span>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 me-2 inline-block text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Customizable style templates</span>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 me-2 inline-block text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Batch processing capabilities</span>
                  </li>
                  <li>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 me-2 inline-block text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>AI-driven image enhancements</span>
                  </li>
                  <li className="opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 me-2 inline-block text-base-content/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="line-through">
                      Seamless cloud integration
                    </span>
                  </li>
                  <li className="opacity-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 me-2 inline-block text-base-content/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="line-through">
                      Real-time collaboration tools
                    </span>
                  </li>
                </ul>
                <div className="mt-6">
                  <button className="btn btn-primary btn-block">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
