import { handleShareCopyLink } from "@/utils/copyHelper";
import { ExportIcon, LinkIcon, XLogoIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function ShareButton({ articleId, title }: { articleId: string, title: string }) {
    const { t } = useTranslation();
    const url = `${window.location.origin}/article/${articleId}`;

    async function handleShareToX() {
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            '_blank'
        )
    }

    return (
        <>
            <button className="btn btn-square btn-ghost" popoverTarget="popover-share" style={{ anchorName: "--anchor-share" }} >
                <ExportIcon size={24} weight="light" />
            </button>
            <ul className="dropdown menu w-42 bg-base-100 shadow-lg"
                popover="auto" id="popover-share" style={{ positionAnchor: "--anchor-share" }}>
                <li>
                    <button className="btn btn-ghost justify-start" onClick={() => handleShareCopyLink(url)}>
                        <LinkIcon size={24} weight="light" />
                        {t('btn.copyLink')}
                    </button>
                </li>
                <li>
                    <button className="btn btn-ghost justify-start" onClick={handleShareToX} >
                        <XLogoIcon size={24} weight="light" />
                        {t('btn.shareOnX')}
                    </button>
                </li>
            </ul>
        </>
    );
}