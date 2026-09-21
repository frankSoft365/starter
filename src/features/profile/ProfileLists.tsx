import { Route as listsRoute } from "@/routes/_app/_protected/profile/$userId/_profile/lists";
import Lists from "./Lists";

export default function ProfileLists() {
  const { userId } = listsRoute.useParams();

  return <Lists userId={userId} />;
}
