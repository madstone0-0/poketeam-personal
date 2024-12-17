import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const initialOptions = {
    defaultLevel: 10,
};

const usePersistantStore = create()(
    immer(
        devtools(
            persist(
                (set) => ({
                    options: initialOptions,
                    updateOptions: (newOptions) =>
                        set((state) => {
                            state.options = newOptions;
                        }),
                }),
                {
                    name: "persistant-storage",
                },
            ),
        ),
    ),
);

export default usePersistantStore;
