import { BellSlashIcon, CaretDownIcon } from "@phosphor-icons/react";
import { useId, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useFollowAction, useFollowStatus } from "./follow";

export type FollowButtonStatus = {
    isFollowing: boolean;
    isPending: boolean;
    isError: boolean;
    onRetry: () => void;
}

type FollowButtonProps = {
    userId: string;
    className?: string;
    pendingVariant?: 'spinner' | 'skeleton';
    status?: FollowButtonStatus;
}

function FollowButtonContent({
    userId,
    className = '',
    pendingVariant = 'spinner',
    status,
}: FollowButtonProps & { status: FollowButtonStatus }) {
    const { t } = useTranslation();
    const id = useId().replace(/:/g, '');
    const popoverId = `popover-follow-${id}`;
    const anchorName = `--anchor-follow-${id}`;
    const popoverRef = useRef<HTMLUListElement>(null);
    const { toggleFollow, isFollowPending } = useFollowAction(userId);
    const isPending = status.isPending || isFollowPending;

    const handleFollowClick = () => {
        if (status.isFollowing) {
            return;
        }

        toggleFollow(1, {
            onSuccess: () => popoverRef.current?.showPopover(),
        });
    };

    const handleUnfollowClick = () => {
        toggleFollow(2, {
            onSuccess: () => popoverRef.current?.hidePopover(),
        });
    };

    if (status.isPending && pendingVariant === 'skeleton') {
        return (
            <div
                className={`skeleton h-8 w-24 rounded-full ${className}`}
                aria-label={t('common.loading')}
            ></div>
        );
    }

    if (status.isError) {
        return (
            <button type="button" className={`btn btn-outline rounded-full min-w-24 ${className}`} onClick={status.onRetry}>
                {t('common.retry')}
            </button>
        );
    }

    return (
        <>
            <button
                type="button"
                className={`btn rounded-full min-w-24 ${status.isFollowing ? 'btn-outline' : 'btn-neutral'} ${className}`}
                style={{ anchorName }}
                aria-controls={popoverId}
                popoverTarget={status.isFollowing ? popoverId : undefined}
                disabled={isPending}
                onClick={handleFollowClick}
            >
                {isPending ? (
                    <span className="loading loading-spinner loading-sm" aria-label={t('common.loading')}></span>
                ) : (
                    <>
                        {t(status.isFollowing ? 'btn.following' : 'btn.follow')}
                        {status.isFollowing && <CaretDownIcon size={16} />}
                    </>
                )}
            </button>
            <ul
                ref={popoverRef}
                id={popoverId}
                popover="auto"
                className="dropdown dropdown-center menu w-40 bg-base-100 shadow-lg"
                style={{ positionAnchor: anchorName }}
            >
                <li>
                    <button type="button" className="text-red-600" disabled={isFollowPending} onClick={handleUnfollowClick}>
                        {isFollowPending ? (
                            <span className="loading loading-spinner loading-sm" aria-label={t('common.loading')}></span>
                        ) : (
                            <>
                                <BellSlashIcon size={24} />
                                {t('btn.unfollow')}
                            </>
                        )}
                    </button>
                </li>
            </ul>
        </>
    );
}

function FollowButtonWithStatusQuery(props: FollowButtonProps) {
    const {
        data: isFollowing,
        isFetching,
        isError,
        retry,
    } = useFollowStatus(props.userId, true);

    return (
        <FollowButtonContent
            {...props}
            status={{
                isFollowing: isFollowing ?? false,
                isPending: isFetching,
                isError,
                onRetry: () => void retry(),
            }}
        />
    );
}

export default function FollowButton(props: FollowButtonProps) {
    if (props.status) {
        return <FollowButtonContent {...props} status={props.status} />;
    }

    return <FollowButtonWithStatusQuery {...props} />;
}
