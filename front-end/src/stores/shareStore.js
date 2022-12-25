import create from "zustand";

export const useShareStore = create((set) => ({
  foodInfo: {
    name: "",
    category: "",
    food_description: "",
    image: "",
    expiry_date: null,
  },
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
    latitude: "",
    longitude: "",
    meet_up_date: null,
    meet_up_time: null,
    meet_up_datetime: null,
  },
  saveFoodInfo: (newFoodInfo) => set({ foodInfo: newFoodInfo }),
  saveShareInfo: (newShareInfo) => set({ shareInfo: newShareInfo }),
  saveMeetUpInfo: (newMeetUpInfo) => set({ meetUpInfo: newMeetUpInfo }),
}))