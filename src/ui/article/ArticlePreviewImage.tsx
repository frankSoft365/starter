import { objectPositionFromRatio } from "@/utils/coverFocus";

export default function ArticlePreviewImage({
  url,
  coverFocusY,
}: {
  url: string;
  coverFocusY: number;
}) {
  return (
    <img
      src={url}
      alt={"The preview image of article"}
      className="w-full aspect-3/2 object-cover"
      style={{
        objectPosition: objectPositionFromRatio(coverFocusY ?? 0.5),
      }}
    />
  );
}
