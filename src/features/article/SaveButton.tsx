import { BookmarkIcon, LockIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  useArticleCollectStatusQuery,
  useIsArticleCollectedQuery,
} from "./useArticleCollectStatus";
import {
  useAddArticleToDefaultList,
  useAddArticleToList,
  useRemoveArticleFromList,
} from "@/features/collection/collection";
import CreateListModal from "./CreateListModal";

export default function SaveButton({ articleId }: { articleId: string }) {
  const { t } = useTranslation();
  const popoverId = `popover-save-${articleId}`;
  const anchorName = `--anchor-save-${articleId}`;
  const popoverRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { isPending: isCollectedPending, data: isCollected } =
    useIsArticleCollectedQuery(articleId);
  const addMutation = useAddArticleToDefaultList(articleId);
  const addToListMutation = useAddArticleToList();
  const removeFromListMutation = useRemoveArticleFromList();

  // 未收藏文章打开 popover 后先 add，add 成功（或已收藏）才查 status
  const statusEnabled = open && (!!isCollected || addMutation.isSuccess);
  const { data: statusList } = useArticleCollectStatusQuery(
    articleId,
    statusEnabled,
  );

  // loading 持续到 statusList 有数据为止，避免 checkbox 未打勾状态闪现
  const isPopoverLoading =
    addMutation.isPending || (statusEnabled && !statusList);

  const handleToggle = () => {
    const el = popoverRef.current;
    setOpen(!!el?.matches(":popover-open"));
  };

  const handleButtonClick = () => {
    // open 是切换前的状态，!open 表示即将打开
    if (
      !open &&
      !isCollected &&
      !addMutation.isSuccess &&
      !addMutation.isPending
    ) {
      addMutation.mutate(undefined, {
        onError: (err) => {
          toast.error(err.message);
          popoverRef.current?.hidePopover?.();
        },
      });
    }
  };

  const openCreateModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    popoverRef.current?.hidePopover?.();
    setShowModal(true);
  };

  return (
    <>
      <div
        className="lg:tooltip"
        data-tip={t("btn.favorite")}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-square btn-ghost"
          popoverTarget={popoverId}
          style={{ anchorName }}
          onClick={handleButtonClick}
          disabled={isCollectedPending}
        >
          <BookmarkIcon size={24} weight={isCollected ? "fill" : "light"} />
        </button>
        <ul
          ref={popoverRef}
          className="dropdown menu w-52 bg-base-100 shadow-lg"
          popover="auto"
          id={popoverId}
          style={{ positionAnchor: anchorName }}
          onToggle={handleToggle}
        >
          {isPopoverLoading ? (
            <li>
              <div className="w-full p-6 flex items-center justify-center">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            </li>
          ) : (
            <>
              {statusList && statusList.length > 0 ? (
                statusList.map((item) => {
                  const isMutating =
                    (addToListMutation.isPending &&
                      addToListMutation.variables?.listId === item.listId) ||
                    (removeFromListMutation.isPending &&
                      removeFromListMutation.variables?.listId === item.listId);
                  return (
                    <li key={item.listId}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center justify-start gap-2">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm checkbox-success"
                            checked={item.isCollected}
                            disabled={isMutating}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addToListMutation.mutate({
                                  articleId,
                                  listId: item.listId,
                                });
                              } else {
                                removeFromListMutation.mutate({
                                  articleId,
                                  listId: item.listId,
                                });
                              }
                            }}
                          />
                          <span className="truncate flex-1">
                            {item.listName}
                          </span>
                        </div>
                        <div>
                          {item.isPublic === 0 && (
                            <LockIcon
                              size={14}
                              weight="fill"
                              className="opacity-50"
                            />
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="px-4 py-3 text-sm opacity-60">
                  {t("article.collect.emptyList")}
                </li>
              )}
              <li>
                <button
                  className="btn btn-ghost btn-success justify-start"
                  onClick={openCreateModal}
                >
                  {t("btn.createNewList")}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {showModal && (
        <CreateListModal
          articleId={articleId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
