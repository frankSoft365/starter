import { toast } from "sonner";

export async function handleShareCopyLink(url: string) {
    try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied');
    } catch (err) {
        console.error('Clipboard write failed', err);
        toast.error('Failed to copy link, please copy manually');
    }
}