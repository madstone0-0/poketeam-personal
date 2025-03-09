import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ping } from "../utils";
import { TeamPokemon, User } from "../../types";

// type User = {
//     username?: string;
//     email?: string;
//     fname?: string;
//     lname?: string;
//     password?: string;
//     is_admin: boolean;
//     uid?: number;
// };

const initialUser: User = {
    uname: "",
    email: "",
    fname: "",
    lname: "",
    isAdmin: false,
    uid: 0,
};

type ResetOps = {
    username?: string;
    email?: string;
    fname?: string;
    lname?: string;
    uid?: number;
    pokemon?: TeamPokemon;
    team?: number;
    admin?: boolean;
};

export type UserState = {
    user: User;
    selectedPokemon?: TeamPokemon;
    selectedTeam?: number;

    setSelectedTeam: (val: number) => void;
    setSelectedPokemon: (val: TeamPokemon) => void;
    updateUsername: (val: string) => void;
    updateEmail: (val: string) => void;
    updateFname: (val: string) => void;
    updateLname: (val: string) => void;
    updateUid: (val: number) => void;
    reset: (opts?: ResetOps) => void;
};

const useStore = create<UserState>()(
    immer(
        devtools(
            persist(
                (set) => ({
                    user: initialUser,
                    selectedPokemon: undefined,
                    selectedTeam: undefined,

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
                            state.user.uname = val;
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
                                state.selectedPokemon = undefined;
                                state.selectedTeam = undefined;
                                return;
                            }

                            const { username, email, fname, lname, uid, pokemon, team, admin } = opts;
                            if (username) state.user.uname = username;
                            if (email) state.user.email = email;
                            if (fname) state.user.fname = fname;
                            if (lname) state.user.lname = lname;
                            if (uid) state.user.uid = uid;
                            if (pokemon) state.selectedPokemon = pokemon;
                            if (team) state.selectedTeam = team;
                            if (admin) state.user.isAdmin = admin;
                        }),
                }),
                {
                    name: "userStore",
                    storage: createJSONStorage(() => sessionStorage),
                    onRehydrateStorage: (state) => {
                        console.log("Rehydrating state");
                        ping()
                            .then((res) => {
                                if (!res) state.reset();
                            })
                            .catch((err) => console.error(`Ping error -> ${err}`));

                        return (_state, error) => {
                            if (error) {
                                console.error("Error rehydrating state", error);
                            }
                        };
                    },
                },
            ),
            {
                name: "global-storage",
            },
        ),
    ),
);

export default useStore;
