import { ExportIcon, LinkIcon, XLogoIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function ShareButton({ articleId, title }: { articleId: string, title: string }) {

    const url = `${window.location.origin}/article/${articleId}`;

    async function handleShareCopyLink() {

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied');
        } catch (err) {
            console.error('Clipboard write failed', err);
            toast.error('Failed to copy link, please copy manually');
        }
    }

    async function handleShareToX() {
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
            '_blank'
        )
    }

    return (
        <>
            <button className="btn btn-square btn-ghost" popoverTarget="popover-share" style={{ anchorName: "--anchor-share" }} >
                <ExportIcon size={24} color="#676565" weight="light" />
            </button>
            <ul className="dropdown menu w-42 bg-base-100 shadow-lg"
                popover="auto" id="popover-share" style={{ positionAnchor: "--anchor-share" }}>
                <li>
                    <button className="btn btn-ghost justify-start" onClick={handleShareCopyLink}>
                        <LinkIcon size={24} weight="light" />
                        Copy link
                    </button>
                </li>
                <li>
                    <button className="btn btn-ghost justify-start" onClick={handleShareToX} >
                        <XLogoIcon size={24} weight="light" />
                        Share on X
                    </button>
                </li>
            </ul>
        </>
    );
}