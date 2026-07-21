import Avatar from "@/ui/Avatar";
import { ChatCircleDotsIcon, ThumbsUpIcon } from "@phosphor-icons/react";

type CommentItemProps = {
    avatarUrl?: string;
    username: string;
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
    replyToUsername,
    createdAt,
    body,
    likes = 0,
    size = "md",
    onReply,
}: CommentItemProps) {
    const isSmall = size === "sm";
    const actionSize = isSmall ? "btn-xs" : "btn-sm";
    const headingSize = isSmall ? "text-xs" : "text-sm";
    const bodySize = isSmall ? "text-sm" : "text-base";

    return (
        <li className="list-row">
            <div><Avatar imageUrl={avatarUrl} username={username} size={size} /></div>
            <div>
                <div className={headingSize}>
                    <strong>{username}</strong>
                    {replyToUsername
                        ?
                        <span>
                            <em> reply to </em>
                            <span className="text-blue-500">
                                {replyToUsername}
                            </span>
                        </span>
                        : ''
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
