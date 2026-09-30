import { userAtom } from "@/atoms/user";
import { useAtomValue } from "jotai";

/* 如果是当前用户那么渲染children 如果不是 渲染fallback */
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
