import { useRef } from "react";

export function useCommentAreaScroll() {
  const commentRef = useRef<HTMLDivElement | null>(null);
  function scrollToComments() {
    commentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return {
    commentRef,
    scrollToComments,
  };
}
