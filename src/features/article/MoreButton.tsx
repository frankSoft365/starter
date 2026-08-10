import CurrentUser from "@/ui/CurrentUser";
import { DotsThreeIcon, ThumbsDownIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";

export default function MoreButton({
    isOwnStory,
    authorId,
    articleId,
    onDelete,
}: {
    isOwnStory: boolean,
    authorId: string,
    articleId: string,
    onDelete: () => void,
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const popoverId = `popover-more-${articleId}`;
    const anchorName = `--anchor-more-${articleId}`;

    return (
        <div className="lg:tooltip" data-tip={t('btn.more')} onClick={(e) => e.stopPropagation()}>
            <button
                className="btn btn-square btn-ghost"
                popoverTarget={popoverId}
                style={{ anchorName }}
            >
                <DotsThreeIcon size={24} weight="bold" />
            </button>
            <ul className="dropdown menu w-52 bg-base-100 shadow-lg"
                popover="auto" id={popoverId} style={{ positionAnchor: anchorName }}>
                {!isOwnStory && <li>
                    <button className="btn btn-ghost justify-start">
                        <ThumbsDownIcon size={24} weight="light" />
                        Show less like this
                    </button>
                </li>}
                <CurrentUser authorId={authorId}>
                    <li>
                        <button onClick={() => navigate({ to: articleEditRoute.to, params: { articleId: articleId } })} className="btn btn-ghost justify-start">
                            {t('btn.editArticle')}
                        </button>
                    </li>
                </CurrentUser>
                {!isOwnStory && <li><button className="btn btn-ghost justify-start">
                    Follow author
                </button></li>}
                {!isOwnStory && <li><button className="btn btn-ghost justify-start text-red-600">
                    Report story...
                </button></li>}
                <CurrentUser authorId={authorId}>
                    <li>
                        <button onClick={() => {
                            onDelete();
                        }} className="btn btn-ghost justify-start text-red-600">
                            {t('btn.deleteArticle')}
                        </button>
                    </li>
                </CurrentUser>
            </ul>
        </div>
    );
}