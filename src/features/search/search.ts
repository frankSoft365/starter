import { recentSearchesAtom } from "@/atoms/search";
import { type UseNavigateResult } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useEffect, useState, type SetStateAction } from "react";

export function useSearchInput(
  q: string,
  setRecentSearches: (value: SetStateAction<string[]>) => void,
  navigate: UseNavigateResult<string>,
) {
  const [searchInput, setSearchInput] = useState(q);
  useEffect(() => {
    setSearchInput(q);
  }, [q]);
  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (searchInput) {
        setRecentSearches((previous) => [
          ...new Set([...previous, searchInput]),
        ]);
      }
      navigate({ to: "/search", search: { q: searchInput } });
    }
  }

  return { searchInput, setSearchInput, handleSearch };
}

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useAtom(recentSearchesAtom);
  function handleDeleteRecentSearches(
    deleteItem: string,
    e: React.MouseEvent<HTMLButtonElement>,
  ) {
    e.stopPropagation();
    setRecentSearches((previous) =>
      previous.filter((item) => item !== deleteItem),
    );
  }

  return {
    recentSearches,
    setRecentSearches,
    handleDeleteRecentSearches,
  };
}
