import Avatar from "@/ui/Avatar";
import { ChatCircleDotsIcon, ThumbsUpIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

type CommentItemProps = {
    avatarUrl?: string;
    username: string;
    isAuthor: boolean;
    replyToUsername?: string | null;
    createdAt?: string;
    body: string;
    likes?: number;
    size?: "md" | "sm";
    onReply?: () => void;
};

export default function CommentItem({
    avatarUrl,
    username,
    isAuthor,
    replyToUsername,
    createdAt,
    body,
    likes = 0,
    size = "md",
    onReply,
}: CommentItemProps) {
    const { t } = useTranslation();
    const isSmall = size === "sm";
    const actionSize = isSmall ? "btn-xs" : "btn-sm";
    const headingSize = isSmall ? "text-xs" : "text-sm";
    const bodySize = isSmall ? "text-sm" : "text-base";

    return (
        <li className="list-row">
            <div><Avatar imageUrl={avatarUrl} username={username} size={size} /></div>
            <div>
                <div className={headingSize}>
                    <span><strong>{username}</strong></span>
                    {isAuthor && <div className="badge badge-xs badge-primary ml-2">{t('badge.author')}</div>}
                    {replyToUsername
                        ?
                        <span className={headingSize}>
                            <em> {t('comment.replyTo')} </em>
                            <span className="text-blue-500">
                                {replyToUsername}
                            </span>
                        </span>
                        : null
                    }
                </div>

                {createdAt ? <div className="text-xs text-gray-500">{createdAt}</div> : null}
            </div>
            <p className={`list-col-wrap ${bodySize} mb-2`}>
                {body}
            </p>
            <button type="button" className={`btn btn-ghost ${actionSize}`}>
                <ThumbsUpIcon size={isSmall ? 20 : 24} color="#676565" />
                {likes && likes}
            </button>
            <button type="button" onClick={onReply} className={`btn btn-ghost ${actionSize}`}>
                <ChatCircleDotsIcon size={isSmall ? 20 : 24} color="#676565" />
            </button>
        </li>
    );
}
