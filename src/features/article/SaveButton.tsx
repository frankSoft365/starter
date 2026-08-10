import { BookmarkIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function SaveButton({ articleId }: { articleId: string }) {
    const { t } = useTranslation();
    const popoverId = `popover-save-${articleId}`;
    const anchorName = `--anchor-save-${articleId}`;

    return (
        <div className="lg:tooltip" data-tip={t('btn.favorite')} onClick={(e) => e.stopPropagation()} >
            <button className="btn btn-square btn-ghost" popoverTarget={popoverId} style={{ anchorName }} >
                <BookmarkIcon size={24} weight="light" />
            </button>
            <ul className="dropdown menu w-52 bg-base-100 shadow-lg"
                popover="auto" id={popoverId} style={{ positionAnchor: anchorName }}>
                {/* <li>
                    <div className="w-full p-6 flex items-center justify-center">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                </li> */}
                <li>
                    <button className="btn btn-ghost justify-start">
                        Reading list
                    </button>
                </li>
                <li>
                    <button className="btn btn-ghost justify-start" >
                        Create new list
                    </button>
                </li>
            </ul>
        </div>
    );
}