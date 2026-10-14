import type { ImageMetaData } from "@/types/article";
import { objectPositionFromRatio } from "@/utils/coverFocus";

export default function ArticlePreviewImage({
  imageMetaData,
}: {
  imageMetaData: ImageMetaData;
}) {
  return (
    <img
      src={imageMetaData.url ?? undefined}
      alt={"The preview image of article"}
      className="w-full aspect-3/2 object-cover"
      style={{
        objectPosition: objectPositionFromRatio(
          imageMetaData.coverFocusY ?? 0.5,
        ),
      }}
    />
  );
}
