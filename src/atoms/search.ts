import { atomWithStorage } from "jotai/utils";

export const recentSearchesAtom = atomWithStorage<string[]>(
  "recent_searches|queries",
  [],
);
