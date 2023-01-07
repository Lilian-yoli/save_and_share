import create from "zustand";

const initialState = {
  searchParams: {
    category: "",
    name: "",
    county: "",
    district: ""
  },
  searchResultList: []
};

const state = JSON.parse(JSON.stringify(initialState));

export const useSearchStore = create((set) => ({
  ...state,
  setSearchParams: (newSearchParams) => set({ searchParams: newSearchParams }),
  setSearchResult: (newSearchResultList) => set({ searchResultList: newSearchResultList }),
  clearSearchStore: () => set({ ...initialState })
}))