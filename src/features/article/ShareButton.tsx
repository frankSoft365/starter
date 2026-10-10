import { handleShareCopyLink } from "@/utils/copyHelper";
import { ExportIcon, LinkIcon, XLogoIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function ShareButton({
  articleId,
  title,
}: {
  articleId: string;
  title: string;
}) {
  const popoverId = `popover-share-${articleId}`;
  const anchorName = `--anchor-share-${articleId}`;
  const { t } = useTranslation();
  const url = `${window.location.origin}/article/${articleId}`;

  async function handleShareToX() {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank",
    );
  }

  return (
    <>
      <div className="lg:tooltip" data-tip={t("btn.share")}>
        <button
          className="btn btn-square btn-ghost"
          popoverTarget={popoverId}
          style={{ anchorName: anchorName }}
        >
          <ExportIcon size={24} weight="light" />
        </button>
      </div>
      <ul
        className="dropdown menu w-42 bg-base-100 shadow-lg"
        popover="auto"
        id={popoverId}
        style={{ positionAnchor: anchorName }}
      >
        <li>
          <button onClick={() => handleShareCopyLink(url)}>
            <LinkIcon size={24} weight="light" />
            {t("btn.copyLink")}
          </button>
        </li>
        <li>
          <button onClick={handleShareToX}>
            <XLogoIcon size={24} weight="light" />
            {t("btn.shareOnX")}
          </button>
        </li>
      </ul>
    </>
  );
}
