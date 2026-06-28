import { userAtom } from "@/atoms/user";
import { useAtomValue } from "jotai";

export default function CurrentUser({ authorId, children }: { authorId: string, children: React.ReactNode }) {
    const user = useAtomValue(userAtom);

    if (!user || user.id !== authorId) {
        return null;
    }

    return children;
}