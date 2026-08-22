import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    BookmarkSimpleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import Loading from "@/ui/Loading";
import ArticleListItem from "@/features/home/ArticleListItem";
import type { ArticleListItemVO } from "@/types/article";
import { useCollectionListArticlesQuery, useCollectionListQuery, useRemoveArticleFromList, useRemoveArticlesFromList } from "./collection";
import { Route as listRoute } from "@/routes/_app/_protected/profile/$userId/_profile/lists";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import CollectionListInfo from "./CollectionListInfo";
import { Route as listDetailRoute } from "@/routes/_app/_protected/profile/$userId/lists.$listId";
import { useAtomValue } from "jotai";
import { userAtom } from "@/atoms/user";

function isDeletedArticle(article: ArticleListItemVO): boolean {
    return !!article.id && !article.title;
}

export default function CollectionListDetail() {
    const { listId } = listDetailRoute.useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const user = useAtomValue(userAtom);
    const queryClient = useQueryClient();
    const [removeMode, setRemoveMode] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const { data: list } = useCollectionListQuery(listId);
    const { data: articles, status, error } = useCollectionListArticlesQuery(listId);

    const removeMutation = useRemoveArticleFromList();
    const batchRemoveMutation = useRemoveArticlesFromList();

    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const exitRemoveMode = () => {
        setRemoveMode(false);
        setSelected(new Set());
    };

    return (
        <div className="w-full md:w-3xl md:mx-auto">
            {/* Header */}
            <div className="w-full p-4">
                {list && (
                    <CollectionListInfo
                        list={list}
                        detail
                        removeMode={removeMode}
                        selectedCount={selected.size}
                        onRemoveItems={() => setRemoveMode(true)}
                        onCancelRemove={exitRemoveMode}
                        onConfirmRemove={() => { batchRemoveMutation.mutate({ listId, articleIds: Array.from(selected) }, { onSuccess: () => { toast.success(t('profile.list.removedTip')); exitRemoveMode(); } }); }}
                        onDelete={() => navigate({ to: listRoute.to, params: { userId: user?.id ?? '' } })}
                    />
                )}
            </div>

            {/* Content */}
            <div>
                {status === 'pending' && <Loading />}
                {status === 'error' && (
                    <div className="flex flex-col items-center justify-center gap-3 py-16">
                        <p className="text-red-500">
                            {t('common.error')}: {error.message}
                        </p>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['collection-list-articles', listId] })}
                            className="btn btn-sm btn-outline"
                        >
                            {t('common.retry')}
                        </button>
                    </div>
                )}
                {status === 'success' && articles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 opacity-60">
                        <BookmarkSimpleIcon size={48} weight="light" />
                        <p className="mt-4">{t('profile.list.emptyList')}</p>
                    </div>
                )}
                {status === 'success' && articles.length > 0 && !removeMode && (
                    <ul className="list w-full lg:w-3xl bg-base-100 shadow-md">
                        {articles.map((article) =>
                            isDeletedArticle(article) ? (
                                <DeletedArticleItem key={article.id} article={article} onRemove={() => removeMutation.mutate({ articleId: article.id, listId }, { onSuccess: () => toast.success(t('profile.list.removedTip')) })} />
                            ) : (
                                <div
                                    key={article.id}
                                    onClick={() => navigate({ to: articleRoute.to, params: { articleId: article.id } })}
                                >
                                    <ArticleListItem
                                        article={article}
                                        onDelete={() => toast.error(t('common.featureNotAvailable'))}
                                        onRemoveFromList={() => removeMutation.mutate({ articleId: article.id, listId }, { onSuccess: () => toast.success(t('profile.list.removedTip')) })}
                                    />
                                </div>
                            )
                        )}
                    </ul>
                )}
                {status === 'success' && articles.length > 0 && removeMode && (
                    <ul className="list w-full lg:w-3xl bg-base-100 shadow-md">
                        {articles.map((article) => (
                            <li key={article.id} className="list-row min-h-12 grid-cols-5">
                                <label className="flex items-center gap-3 col-span-5 cursor-pointer p-2">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-sm"
                                        checked={selected.has(article.id)}
                                        onChange={() => toggleSelect(article.id)}
                                    />
                                    <span className="truncate flex-1 text-sm">
                                        {article.title || t('profile.list.storyNoLongerAvailable')}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function DeletedArticleItem({ article, onRemove }: { article: ArticleListItemVO; onRemove: () => void }) {
    const { t } = useTranslation();
    return (
        <li id={`article-list-item-${article.id}`} className="list-row grid-cols-5">
            <div className=" flex flex-col items-end justify-center col-span-5 gap-4">
                <div role="alert" className="alert w-full p-6">
                    <WarningCircleIcon size={24} />
                    <span className="opacity-65 text-base">{t('profile.list.storyNoLongerAvailable')}</span>
                </div>
                <button
                    className="btn btn-outline rounded-full"
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                >
                    {t('profile.list.removeItem')}
                </button>

            </div>
        </li>
    );
}
