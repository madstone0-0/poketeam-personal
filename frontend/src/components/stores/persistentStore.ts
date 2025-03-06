import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type Options = {
    defaultLevel: number;
};

const initialOptions: Options = {
    defaultLevel: 10,
};

type PersistentState = {
    options: Options;

    updateOptions: (newOptions: Options) => void;
};

const usePersistantStore = create<PersistentState>()(
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
                    name: "persistent-store",
                    storage: createJSONStorage(() => localStorage),
                },
            ),
        ),
    ),
);

export default usePersistantStore;
