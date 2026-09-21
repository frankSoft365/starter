import { userAtom } from "@/atoms/user";
import { useAtomValue } from "jotai";
import Lists from "../collection/Lists";
import NeedLogin from "@/ui/NeedLogin";

export default function LibraryLists() {
  const user = useAtomValue(userAtom);

  if (!user) {
    return <NeedLogin />;
  }

  return <Lists userId={user.id} />;
}
