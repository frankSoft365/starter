import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DotsThreeIcon, LockIcon } from "@phosphor-icons/react";
import { Fragment, useRef, useState } from "react";
import type { CollectionListDetailVO } from "@/types/collection";
import { useToggleListPublic } from "./collection";
import DeleteListModal from "./DeleteListModal";
import EditListModal from "./EditListModal";

export default function CollectionListInfo({
    list,
    onRemoveItems,
    detail = false,
    removeMode = false,
    selectedCount = 0,
    onCancelRemove,
    onConfirmRemove,
    onDelete,
}: {
    list: CollectionListDetailVO;
    onRemoveItems?: () => void;
    detail?: boolean;
    removeMode?: boolean;
    selectedCount?: number;
    onCancelRemove?: () => void;
    onConfirmRemove?: () => void;
    onDelete?: () => void;
}) {
    const { t } = useTranslation();
    const popoverId = `popover-list-more-${list.id}`;
    const anchorName = `--anchor-list-more-${list.id}`;
    const popoverRef = useRef<HTMLUListElement>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const togglePublicMutation = useToggleListPublic(list.id);

    return (
        <Fragment>
            <div className="w-full h-full flex flex-col justify-between gap-2">
            {/* 第一层：列表名 */}
            <div className="flex items-center gap-2 mt-4">
                <span className={`font-bold ${detail ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>{list.name}</span>
                {list.isDefault === 1 && (
                    <span className="badge badge-xs badge-neutral shrink-0">{t('profile.list.defaultBadge')}</span>
                )}
            </div>
            {/* 第二层：描述 */}
            <div className="text-xs opacity-60">
                {list.description || ''}
            </div>
            {/* 第三层：文章数 + 公开状态 + more 按钮 */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm opacity-60">{t('profile.list.stories', { count: list.articleCount })}</span>
                    {list.isPublic === 0 && (
                        <span
                            className="lg:tooltip"
                            data-tip={t('profile.list.privateBadge')}
                        >
                            <LockIcon size={16} weight="fill" />
                        </span>
                    )}
                </div>
                {removeMode ? (
                    <div key="remove-mode" className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-outline rounded-full" onClick={onCancelRemove}>
                            {t('btn.cancel')}
                        </button>
                        <button
                            className="btn btn-neutral rounded-full"
                            disabled={selectedCount === 0}
                            onClick={onConfirmRemove}
                        >
                            {t('profile.list.removeSelected')}
                        </button>
                    </div>
                ) : (
                <div key="more" className="lg:tooltip" data-tip={t('btn.more')} onClick={(e) => e.stopPropagation()}>
                    <button
                        type="button"
                        className="btn btn-ghost btn-square"
                        popoverTarget={popoverId}
                        style={{ anchorName }}
                        aria-label={t('btn.more')}
                    >
                        <DotsThreeIcon size={24} weight="bold" />
                    </button>
                    <ul
                        ref={popoverRef}
                        className="dropdown menu w-52 bg-base-100 shadow-lg"
                        popover="auto"
                        id={popoverId}
                        style={{ positionAnchor: anchorName }}
                    >
                        <li>
                            <button
                                type="button"
                                disabled={togglePublicMutation.isPending}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    popoverRef.current?.hidePopover?.();
                                    togglePublicMutation.mutate(undefined, {
                                        onSuccess: () => {
                                            toast.success(t('profile.list.toggledPublicTip'));
                                        },
                                    });
                                }}
                            >
                                {list.isPublic === 1
                                    ? t('profile.list.makePrivate')
                                    : t('profile.list.makePublic')}
                            </button>
                        </li>
                        {list.articleCount >= 2 && (
                            <li>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        popoverRef.current?.hidePopover?.();
                                        if (onRemoveItems) {
                                            onRemoveItems();
                                        } else {
                                            toast.info(t('common.featureNotAvailable'));
                                        }
                                    }}
                                >
                                    {t('profile.list.removeItems')}
                                </button>
                            </li>
                        )}
                        {list.isDefault !== 1 && (
                            <li>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        popoverRef.current?.hidePopover?.();
                                        setShowEditModal(true);
                                    }}
                                >
                                    {t('profile.list.editInfo')}
                                </button>
                            </li>
                        )}
                        {list.isDefault !== 1 && (
                            <li>
                                <button
                                    type="button"
                                    className="text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        popoverRef.current?.hidePopover?.();
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    {t('profile.list.deleteList')}
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
                )}
            </div>
        </div>
        {showEditModal && (
            <EditListModal
                list={list}
                onClose={() => setShowEditModal(false)}
            />
        )}
        {showDeleteModal && (
            <DeleteListModal
                listId={list.id}
                onClose={() => setShowDeleteModal(false)}
                onDeleted={onDelete}
            />
        )}
        </Fragment>
    );
}
