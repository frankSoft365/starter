import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Route as libraryIndexRoute } from "@/routes/_app/_protected/me/lists/index";
import { Route as libraryReadingHistoryRoute } from "@/routes/_app/_protected/me/lists/reading-history";
import CreateListModal from "@/features/article/CreateListModal";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);

  const yourLibraryTabMap: {
    name: string;
    path: string;
  }[] = [
    {
      name: "Your lists",
      path: libraryIndexRoute.to,
    },
    {
      name: "Reading history",
      path: libraryReadingHistoryRoute.to,
    },
  ];

  return (
    <div className="w-full px-4 lg:px-0 lg:w-3/5 lg:mx-auto">
      <div className="my-6 lg:mt-12 lg:mb-10 flex flex-row items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold">Your library</h1>
        <button
          type="button"
          className="btn btn-success rounded-full"
          onClick={() => setIsCreateListModalOpen(true)}
        >
          New list
        </button>
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
