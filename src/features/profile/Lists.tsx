import Loading from "@/ui/Loading";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useCollectionListsQuery } from "../collection/collection";
import { Route as listsRoute } from "@/routes/_app/_protected/profile/$userId/_profile/lists";
import { BookmarkSimpleIcon } from "@phosphor-icons/react";
import { CollectionListRow } from "../collection/CollectionListRow";

export default function Lists() {
  const { t } = useTranslation();
  const { userId } = listsRoute.useParams();
  const queryClient = useQueryClient();
  const { data: lists, status, error } = useCollectionListsQuery(userId);

  return (
    <div className="w-full">
      {status === "pending" && <Loading />}
      {status === "error" && (
        <div className="flex flex-col items-center justify-center gap-3 p-6">
          <p className="text-red-500">
            {t("common.error")}: {error.message}
          </p>
          <button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["collection-lists", userId],
              })
            }
            className="btn btn-sm btn-outline"
          >
            {t("common.retry")}
          </button>
        </div>
      )}
      {status === "success" && lists.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 opacity-60">
          <BookmarkSimpleIcon size={48} weight="light" />
          <p className="mt-4">{t("profile.list.emptyList")}</p>
        </div>
      )}
      {status === "success" && lists.length > 0 && (
        <ul className="list bg-base-100 rounded-box shadow-md">
          {lists.map((list) => (
            <CollectionListRow key={list.id} list={list} />
          ))}
        </ul>
      )}
    </div>
  );
}
