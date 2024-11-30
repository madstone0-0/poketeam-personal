import React, { createContext, useState } from "react";
import useStore from "../stores";

export const PokeContext = createContext();

const PoketeamProvider = ({ children }) => {
    const username = useStore((state) => state.username);
    const updateUsername = useStore((state) => state.updateUsername);
    const usernameState = { username, updateUsername };

    const email = useStore((state) => state.email);
    const updateEmail = useStore((state) => state.updateEmail);
    const emailState = { email, updateEmail };

    const fname = useStore((state) => state.fname);
    const updateFname = useStore((state) => state.updateFname);
    const fnameState = { fname, updateFname };

    const lname = useStore((state) => state.lname);
    const updateLname = useStore((state) => state.updateLname);
    const lnameState = { lname, updateLname };

    const uid = useStore((state) => state.uid);
    const updateUid = useStore((state) => state.updateUid);
    const uidState = { uid, updateUid };

    const teams = useStore((state) => state.teams);
    const setTeams = useStore((state) => state.setTeams);
    const teamsState = { teams, setTeams };

    const reset = useStore((state) => state.reset);

    return (
        <PokeContext.Provider
            value={{
                usernameState,
                emailState,
                fnameState,
                lnameState,
                teamsState,
                uidState,
                reset,
            }}
        >
            {children}
        </PokeContext.Provider>
    );
};

export default PoketeamProvider;
