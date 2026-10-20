import { APPEARANCE_MODAL_ID } from "@/constants/modal";
import { themeAtom } from "@/atoms/theme";
import { CheckIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useAtom } from "jotai";

export default function AppearanceModal() {
  const [theme, setTheme] = useAtom(themeAtom);
  const isLightThemeSelected = theme === "light" || theme === null;

  return (
    <dialog id={APPEARANCE_MODAL_ID} className="modal">
      <div className="modal-box w-11/12 rounded-sm md:w-lg flex flex-col gap-4 items-center pt-6 px-6">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h1 className="text-center font-medium text-xl">
          Appearance
          <div className="badge badge-xs ml-2 bg-base-300 badge-outline">
            Beta
          </div>
        </h1>
        <p className="text-sm text-center mt-2 mb-4">
          This feature is still in beta! You can read all stories across Medium
          in dark mode, but you might run into an occasional area on Medium that
          is still under dark mode construction.
        </p>
        <div className="w-full flex flex-col">
          <button
            onClick={() => setTheme("light")}
            className={`btn rounded-b-none border-b-0 btn-xl font-normal text-sm justify-between ${isLightThemeSelected ? "bg-base-300" : "bg-base-100"}`}
            data-set-theme="light"
          >
            <span className="flex items-center gap-4">
              <SunIcon size={18} />
              Light
            </span>
            {isLightThemeSelected && <CheckIcon size={24} />}
          </button>
          <button
            onClick={() => setTheme("dracula")}
            className={`btn rounded-t-none btn-xl font-normal text-sm bg-base-100 justify-between ${theme === "dracula" ? "bg-base-200" : "bg-base-100"}`}
            data-set-theme="dracula"
            data-act-class="btn-active"
          >
            <span className="flex items-center gap-4">
              <MoonIcon size={18} />
              Dark
            </span>
            {theme === "dracula" && <CheckIcon size={24} />}
          </button>
        </div>

        <div className="modal-action w-full justify-end">
          <form method="dialog">
            {/* if there is a button, it will close the modal */}
            <button className="btn btn-neutral btn-sm md:btn-md rounded-full">
              Done
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
