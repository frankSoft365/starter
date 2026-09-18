import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { Route as HelpCenterHomeRoute } from "@/routes/_protected/hc/index";

export default function LinkDetailBar() {
  const navigate = useNavigate();
  function linkToHCHome() {
    navigate({ to: HelpCenterHomeRoute.to });
  }
  return (
    <div className="w-full px-4 md:px-28 py-4 shadow-sm flex flex-wrap items-center justify-between">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <a onClick={linkToHCHome} className="opacity-65">
              Aedium Help Center
            </a>
          </li>
          <li>Add Document</li>
        </ul>
      </div>
      <label className="input rounded-full ">
        <MagnifyingGlassIcon size={24} />
        <input type="search" required placeholder="Search" />
      </label>
    </div>
  );
}
