import { useSearchStore } from '@/stores/search-store';

/**
 * The text in the native header search bar, shared between the header that
 * owns the input and the screen that renders results.
 */
export function useSearch() {
  const searchText = useSearchStore((state) => state.searchText);
  const setSearchText = useSearchStore((state) => state.setSearchText);

  return { searchText, setSearchText };
}

/**
 * Write-only half of `useSearch`, for the header itself: subscribing to the
 * text there would re-render the whole navigator on every keystroke.
 */
export function useSetSearchText() {
  return useSearchStore((state) => state.setSearchText);
}
