import { atomWithStorage } from "jotai/utils";

type Theme = "light" | "dracula" | null;

const themeStorage = {
  getItem: (key: string): Theme => {
    const value = localStorage.getItem(key);
    return value === "light" || value === "dracula" ? value : null;
  },
  setItem: (key: string, value: Theme) => {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => localStorage.removeItem(key),
};

export const themeAtom = atomWithStorage<Theme>("theme", null, themeStorage, {
  getOnInit: true,
});
