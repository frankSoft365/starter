import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Route as libraryIndexRoute } from "@/routes/_app/_protected/me/lists/index";
import { Route as libraryReadingHistoryRoute } from "@/routes/_app/_protected/me/lists/reading-history";
import CreateListModal from "@/features/collection/CreateListModal";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);

  const yourLibraryTabMap: {
    name: string;
    path: string;
  }[] = [
    {
      name: t("library.tab.yourLists"),
      path: libraryIndexRoute.to,
    },
    {
      name: t("library.tab.readingHistory"),
      path: libraryReadingHistoryRoute.to,
    },
  ];

  const isLibraryIndexRoute = location.pathname === libraryIndexRoute.to;

  return (
    <div className="w-full px-4 lg:px-0 lg:w-3/5 lg:mx-auto">
      <div className="my-6 lg:mt-12 lg:mb-10 flex flex-row items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-bold">
          {t("library.title")}
        </h1>
        {isLibraryIndexRoute && (
          <button
            type="button"
            className="btn btn-success btn-sm md:btn-md rounded-full text-base-100"
            onClick={() => setIsCreateListModalOpen(true)}
          >
            {t("btn.createNewList")}
          </button>
        )}
      </div>
      {/* tab */}
      <div role="tablist" className="tabs tabs-border mb-4">
        {yourLibraryTabMap.map((item) => {
          return (
            <a
              role="tab"
              key={item.path}
              className={`tab ${location.pathname === item.path ? "tab-active" : ""}`}
              onClick={() => navigate({ to: item.path })}
            >
              {item.name}
            </a>
          );
        })}
      </div>
      {isCreateListModalOpen && (
        <CreateListModal onClose={() => setIsCreateListModalOpen(false)} />
      )}
      <div>{children}</div>
    </div>
  );
}
