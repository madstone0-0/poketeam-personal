import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const tempStore = create(
    immer(
        devtools(
            persist((set) => ({
                pickerOpen: false,
                searchTerm: "",


                setPickerOpen: (val) =>
                    set((state) => {
                        state.pickerOpen = val;
                    }),

                setSearchTerm: (val) =>
                    set((state) => {
                        state.searchTerm = val;
                    }),
                reset: () =>
                    set(() => ({
                        pickerOpen: false,
                        searchTerm: "",
                    })),
            })),
            {
                name: "temp-store",
                storage: createJSONStorage(() => sessionStorage),
                onRehydrateStorage: (state) => {
                    state.reset();
                    console.log("Rehydrated temp store");
                },
            },
        ),
    ),
);

export default tempStore;
