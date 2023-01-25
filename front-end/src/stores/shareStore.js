import { create } from "zustand";

const initialState = {
  foodInfo: {
    name: "",
    category: "",
    food_description: "",
    expiry_date: null,
  },
  image: "",
  shareInfo: {
    unit_description: "",
    total_portions: undefined,
    own_portions: undefined,
    price: undefined,
  },
  meetUpInfo: {
    county: "",
    district: "",
    address: "",
    location: {
      lat: "",
      lng: ""
    },
    meet_up_date: null,
    meet_up_time: null,
    meet_up_datetime: null,
  }
}

const state = JSON.parse(JSON.stringify(initialState));

export const useShareStore = create((set) => ({
  ...state,
  saveFoodInfo: (newFoodInfo) => set({ foodInfo: newFoodInfo }),
  saveShareInfo: (newShareInfo) => set({ shareInfo: newShareInfo }),
  saveMeetUpInfo: (newMeetUpInfo) => set({ meetUpInfo: newMeetUpInfo }),
  saveImg: (filename) => set({ image: filename }),
  resetShareForm: () => set({ ...initialState })
}))