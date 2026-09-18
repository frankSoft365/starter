import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export default function HomeSearch() {
  return (
    <div
      className="hero"
      style={{
        backgroundImage:
          "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center py-12 md:py-24">
        <div className="max-w-md">
          <h1 className="mb-5 text-3xl md:text-5xl font-bold">
            How can we help?
          </h1>

          <label className="input rounded-full w-full">
            <MagnifyingGlassIcon size={24} />
            <input type="search" required placeholder="Search" />
          </label>
        </div>
      </div>
    </div>
  );
}
