import { REPOST_USER_LIST_MODAL_ID } from "@/constants/modal";
import { useEffect, useState } from "react";

export default function RepostUserListModal({
  showSignal,
}: {
  showSignal: number;
}) {
  useEffect(() => {
    if (!showSignal) {
      return;
    }
    setQueryEnable(true);
  }, [showSignal]);
  // "PostRepostersDialogQuery"
  // params
  // after: null
  // containsNote: true
  // first: 10
  // postId: "aa961e97a0fb"

  // "id": "aa961e97a0fb",
  // "repostCount": 29,
  // "repostNoteCount": 1,
  // "reposters": {
  //     "edges": [
  //         {
  //             "cursor": "a0c7aafa9de9",
  //             "node": {
  //                 "note": "Sometimes a story makes me genuinely yearn for degrowth. 🤦‍♂️",
  //                 "hideTime": null,
  //                 "user": {
  //                     "id": "a0c7aafa9de9",
  //                     "username": "tjsmedley",
  //                     "__typename": "User",
  //                     "name": "Tim Smedley",
  //                     "customDomainState": null,
  //                     "hasSubdomain": false,
  //                     "imageId": "1*sBCZIJ9aOc4u4k3fUyHADw.jpeg",
  //                     "newsletterV3": {
  //                         "id": "73b0d79e4dd9",
  //                         "type": "NEWSLETTER_TYPE_AUTHOR",
  //                         "slug": "a0c7aafa9de9",
  //                         "name": "a0c7aafa9de9",
  //                         "collection": null,
  //                         "user": {
  //                             "id": "a0c7aafa9de9",
  //                             "name": "Tim Smedley",
  //                             "username": "tjsmedley",
  //                             "newsletterV3": {
  //                                 "id": "73b0d79e4dd9",
  //                                 "__typename": "NewsletterV3"
  //                             },
  //                             "__typename": "User"
  //                         },
  //                         "__typename": "NewsletterV3"
  //                     }
  //                 },
  //                 "__typename": "Reposter",
  //                 "id": "a0c7aafa9de9:aa961e97a0fb"
  //             },
  //             "__typename": "ReposterEdge"
  //         }
  //     ],
  //     "pageInfo": {
  //         "endCursor": null,
  //         "hasNextPage": false,
  //         "__typename": "PageInfoV2"
  //     },
  //     "__typename": "ReposterConnection"
  // },
  const [tab, setTab] = useState<"reposts" | "notes">("notes");
  const [queryEnable, setQueryEnable] = useState<boolean>(false);
  return (
    <dialog id={REPOST_USER_LIST_MODAL_ID} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-center text-lg">27 reposts</h3>
        <div role="tablist" className="tabs tabs-border">
          <a
            role="tab"
            onClick={() => setTab("notes")}
            className={`tab ${tab === "notes" ? "tab-active" : ""}`}
          >
            Notes 1
          </a>
          <a
            role="tab"
            onClick={() => setTab("reposts")}
            className={`tab ${tab === "reposts" ? "tab-active" : ""}`}
          >
            Reposts 26
          </a>
        </div>
        {queryEnable && (
          <div>
            {tab === "notes" && <NoteList />}
            {tab === "reposts" && <RepostList />}
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

function NoteList() {
  useEffect(() => {
    console.log("query note list");
  }, []);
  return <div>note list</div>;
}

function RepostList() {
  useEffect(() => {
    console.log("query without note list");
  }, []);
  return <div>without note list</div>;
}
