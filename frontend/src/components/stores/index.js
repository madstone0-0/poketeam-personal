import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ping } from "../utils";

const initialUser = {
    username: null,
    email: null,
    fname: null,
    lname: null,
    is_admin: false,
    uid: null,
};

const useStore = create(
    immer(
        devtools(
            persist((set) => ({
                user: initialUser,
                selectedPokemon: null,
                selectedTeam: null,

                setSelectedTeam: (val) =>
                    set((state) => {
                        state.selectedTeam = val;
                    }),

                setSelectedPokemon: (val) =>
                    set((state) => {
                        state.selectedPokemon = val;
                    }),

                updateUsername: (val) =>
                    set((state) => {
                        state.user.username = val;
                    }),

                updateEmail: (val) =>
                    set((state) => {
                        state.user.email = val;
                    }),

                updateFname: (val) =>
                    set((state) => {
                        state.user.fname = val;
                    }),

                updateLname: (val) =>
                    set((state) => {
                        state.user.lname = val;
                    }),

                updateUid: (val) =>
                    set((state) => {
                        state.user.uid = val;
                    }),

                reset: (opts) =>
                    set((state) => {
                        if (!opts) {
                            state.user = initialUser;
                            state.selectedPokemon = null;
                            state.selectedTeam = null;
                            return;
                        }

                        const { username, email, fname, lname, uid, pokemon, team, admin } = opts;
                        if (username) state.user.username = username;
                        if (email) state.user.email = email;
                        if (fname) state.user.fname = fname;
                        if (lname) state.user.lname = lname;
                        if (uid) state.user.uid = uid;
                        if (pokemon) state.selectedPokemon = pokemon;
                        if (team) state.selectedTeam = team;
                        if (admin) state.user.is_admin = admin;
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
