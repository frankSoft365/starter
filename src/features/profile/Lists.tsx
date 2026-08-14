import Loading from "@/ui/Loading";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import { Route as listDetailRoute } from "@/routes/_app/_protected/@/lists.$listId";
import type { CollectionListVO, ListCoverItemVO } from "@/types/collection";
import { useCollectionListsQuery } from "./collection";
import CollectionListInfo from "./CollectionListInfo";

const COVER_PREVIEW_MAX = 3;

export default function Lists() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { data: lists, status, error } = useCollectionListsQuery();

    return (
        <div className="w-full">
            {status === 'pending' && <Loading />}
            {status === 'error' && (
                <div className="flex flex-col items-center justify-center gap-3 p-6">
                    <p className="text-red-500">
                        {t('common.error')}: {error.message}
                    </p>
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['collection-lists'] })}
                        className="btn btn-sm btn-outline"
                    >
                        {t('common.retry')}
                    </button>
                </div>
            )}
            {status === 'success' && (
                <ul className="list bg-base-100 rounded-box shadow-md">
                    {lists.map((list) => (
                        <CollectionListRow key={list.id} list={list} />
                    ))}
                </ul>
            )}
        </div>
    );
}

function CollectionListRow({ list }: { list: CollectionListVO }) {
    const navigate = useNavigate();
    const covers = list.coverImages.slice(0, COVER_PREVIEW_MAX);

    const goListDetail = () => navigate({ to: listDetailRoute.to, params: { listId: list.id } });

    return (
        <li
            className="list-row grid-cols-11 cursor-pointer min-h-42"
            onClick={goListDetail}
        >
            {/* 左侧：三层 flex-col */}
            <div className="col-span-6">
                <CollectionListInfo list={list} onRemoveItems={goListDetail} />
            </div>

            {/* 右侧：封面三联 3:2:1 横向 flex，溢出重叠 */}
            <CoverTriptych covers={covers} />
        </li>
    );
}

function CoverTriptych({
    covers,
}: {
    covers: ListCoverItemVO[];
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const basis = ['basis-3/6', 'basis-2/6', 'basis-1/6'];

    return (
        <div className="flex flex-row col-span-5 gap-1 md:gap-2" onClick={(e) => e.stopPropagation()}>
            {[0, 1, 2].map((i) => {
                const cover = covers[i];
                return (
                    <div
                        key={i}
                        className={`${basis[i]} overflow-hidden ${cover?.coverImage ? '' : 'bg-base-200'} ${cover?.isDelete === 1 ? 'grayscale' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!cover) return;
                            if (cover.isDelete === 1) toast.error(t('profile.list.articleDeletedTip'));
                            else navigate({ to: articleRoute.to, params: { articleId: cover.articleId } });
                        }}
                    >
                        {cover?.coverImage && <img src={cover.coverImage} alt="" className="w-full h-full object-cover" />}
                    </div>
                );
            })}
        </div>
    );
}
