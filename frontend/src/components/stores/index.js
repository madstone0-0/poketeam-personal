import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ping } from "../utils";

const useStore = create(
    immer(
        devtools(
            persist((set) => ({
                username: null,
                email: null,
                fname: null,
                lname: null,
                uid: null,
                teams: [],

                updateUsername: (val) =>
                    set((state) => {
                        state.username = val;
                    }),

                updateEmail: (val) =>
                    set((state) => {
                        state.email = val;
                    }),

                updateFname: (val) =>
                    set((state) => {
                        state.fname = val;
                    }),

                updateLname: (val) =>
                    set((state) => {
                        state.lname = val;
                    }),

                updateUid: (val) =>
                    set((state) => {
                        state.uid = val;
                    }),

                setTeams: (val) =>
                    set((state) => {
                        state.teams = val;
                    }),

                reset: (opts) =>
                    set((state) => {
                        if (!opts) {
                            state.username = null;
                            state.email = null;
                            state.fname = null;
                            state.lname = null;
                            state.uid = null;
                            state.teams = [];
                            return;
                        }

                        const { username, email, fname, lname, uid, teams } = opts;
                        if (username) state.username = null;
                        if (email) state.email = null;
                        if (fname) state.fname = null;
                        if (lname) state.lname = null;
                        if (uid) state.uid = null;
                        if (teams) state.teams = [];
                    }),
            })),
            {
                name: "global-storage",
                storage: createJSONStorage(() => sessionStorage),
                onRehydrateStorage: async (state) => {
                    console.log("Rehydrating state", state);
                    if (!(await ping())) state.reset();

                    return (_state, error) => {
                        if (error) {
                            console.error("Error rehydrating state", error);
                        }
                    };
                },
            },
        ),
    ),
);

export default useStore;
