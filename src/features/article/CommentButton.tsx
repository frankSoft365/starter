import { ChatCircleDotsIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function CommentButton({
  scrollToComments,
  responseNum,
}: {
  scrollToComments: () => void;
  responseNum: number;
}) {
  const { t } = useTranslation();
  return (
    <div className="lg:tooltip h-6" data-tip={t("btn.respond")}>
      <div
        className="inline-flex items-center gap-0.5 cursor-pointer opacity-65 hover:opacity-100"
        onClick={scrollToComments}
      >
        <ChatCircleDotsIcon size={24} weight="light" />
        <span className="text-sm font-light">{responseNum && responseNum}</span>
      </div>
    </div>
  );
}
