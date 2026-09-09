import { create } from 'zustand';

type SearchState = {
  searchText: string;
  setSearchText: (text: string) => void;
  clearSearch: () => void;
};

/**
 * The text currently in the native header search bar.
 *
 * Global rather than per-screen so the header (which owns the input) and the
 * screen body (which renders results) can talk without either one having to
 * mount a provider around the other.
 */
export const useSearchStore = create<SearchState>((set) => ({
  searchText: '',
  setSearchText: (searchText) => set({ searchText }),
  clearSearch: () => set({ searchText: '' }),
}));
