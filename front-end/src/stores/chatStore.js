import { create } from "zustand";

const initialState = {
  shareLauncher: ""
};

const state = JSON.parse(JSON.stringify(initialState));

export const useChatStore = create((set) => ({
  ...state,
  setShareLauncher: (newShareLauncher) => set({ shareLauncher: newShareLauncher }),
  clearSearchStore: () => set({ ...initialState })
}))