import { userAtom } from "@/atoms/user";
import type { CollectionListVO, ListCoverItemVO } from "@/types/collection";
import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { Route as listDetailRoute } from "@/routes/_app/_protected/profile/$userId/lists.$listId";
import { toast } from "sonner";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import CollectionInfo from "./CollectionInfo";

const COVER_PREVIEW_MAX = 3;

export function CollectionListRow({ list }: { list: CollectionListVO }) {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);
  const covers = list.coverImages.slice(0, COVER_PREVIEW_MAX);

  const goListDetail = () =>
    navigate({
      to: listDetailRoute.to,
      params: { userId: user?.id ?? "", listId: list.id },
    });

  return (
    <li
      className="list-row grid-cols-11 cursor-pointer min-h-42"
      onClick={goListDetail}
    >
      {/* 左侧：三层 flex-col */}
      <div className="col-span-6">
        <CollectionInfo list={list} onRemoveItems={goListDetail} />
      </div>

      {/* 右侧：封面三联 3:2:1 横向 flex，溢出重叠 */}
      <CoverTriptych covers={covers} />
    </li>
  );
}

function CoverTriptych({ covers }: { covers: ListCoverItemVO[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const basis = ["basis-3/6", "basis-2/6", "basis-1/6"];

  return (
    <div
      className="flex flex-row col-span-5 gap-1 md:gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      {[0, 1, 2].map((i) => {
        const cover = covers[i];
        return (
          <div
            key={i}
            className={`${basis[i]} overflow-hidden ${cover?.coverImage ? "" : "bg-base-200"} ${cover?.isDelete === 1 ? "grayscale" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!cover) return;
              if (cover.isDelete === 1)
                toast.error(t("profile.list.articleDeletedTip"));
              else
                navigate({
                  to: articleRoute.to,
                  params: { articleId: cover.articleId },
                });
            }}
          >
            {cover?.coverImage && (
              <img
                src={cover.coverImage}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
