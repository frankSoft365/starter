const sizeMap = {
  xxs: "w-4",
  xs: "w-6",
  sm: "w-8",
  md: "w-12",
  lg: "w-12",
  xl: "w-22",
};

export default function Avatar({
  imageUrl,
  hover = false,
  username,
  size = "md",
}: {
  imageUrl: string | undefined;
  hover?: boolean;
  username: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
}) {
  const hoverRingConfig =
    "hover:ring-2 ring-offset-2 ring-primary ring-offset-base-100";
  const sizeStyle = sizeMap[size];
  return (
    <>
      {(imageUrl ?? "") !== "" ? (
        <div className="avatar">
          <div
            className={`${sizeStyle} rounded-full ${hover ? hoverRingConfig : ""}`}
          >
            <img src={imageUrl} />
          </div>
        </div>
      ) : (
        <div className="avatar avatar-placeholder">
          <div
            className={`${sizeStyle} bg-neutral text-neutral-content rounded-full ${hover ? hoverRingConfig : ""}`}
          >
            <span className="uppercase">{username.slice(0, 2)}</span>
          </div>
        </div>
      )}
    </>
  );
}
