import Avatar from "@/ui/Avatar";
import { formatDateTime } from "@/utils/dateHelper";
import { ThumbsUpIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

type CommentItemProps = {
    avatarUrl?: string;
    username: string;
    isAuthor: boolean;
    replyToUsername?: string | null;
    createdAt: Date;
    body: string;
    likes?: number;
    liked?: boolean;
    isLiking?: boolean;
    size?: "md" | "sm";
    onReply?: () => void;
    onLike?: () => void;
};

export default function CommentItem({
    avatarUrl,
    username,
    isAuthor,
    replyToUsername,
    createdAt,
    body,
    likes = 0,
    liked = false,
    isLiking = false,
    size = "md",
    onReply,
    onLike,
}: CommentItemProps) {
    const { t } = useTranslation();
    const isSmall = size === "sm";
    const actionSize = isSmall ? "btn-xs" : "btn-sm";
    const headingSize = isSmall ? "text-xs" : "text-sm";
    const bodySize = isSmall ? "text-sm" : "text-base";
    const createdAtStrSize = isSmall ? 'text-sm' : 'text-base';

    const createdAtStr = formatDateTime(new Date(createdAt));

    return (
        <li className="list-row">
            <div><Avatar imageUrl={avatarUrl} username={username} size={size} /></div>
            <div className="w-min-0 flex-1">
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
                <p className={`${bodySize} my-2`}>
                    {body}
                </p>
                <div className="flex flex-row items-center justify-start">
                    {createdAtStr ? <span className={`opacity-60 ${createdAtStrSize}`}>{createdAtStr}</span> : null}
                    <button
                        type="button"
                        onClick={onLike}
                        disabled={isLiking}
                        className={`btn btn-ghost ${actionSize} ml-2`}
                    >
                        {isLiking
                            ? <span className="loading loading-spinner loading-xs"></span>
                            : <ThumbsUpIcon size={isSmall ? 20 : 22} weight={liked ? "fill" : "light"} color={liked ? "#676565" : "#676565"} />
                        }
                        {likes > 0 && likes}
                    </button>
                    <button type="button" onClick={onReply} className={`btn btn-link text-black ${actionSize}`}>
                        {t('btn.reply')}
                    </button>
                </div>
            </div>
        </li>
    );
}
