import { userAtom } from "@/atoms/user";
import { useAtomValue } from "jotai";

export default function CurrentUser({
    authorId,
    children,
    fallback = null,
}: {
    authorId: string;
    children?: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const user = useAtomValue(userAtom);

    if (!user || user.id !== authorId) {
        return fallback;
    }

    return children ?? null;
}
