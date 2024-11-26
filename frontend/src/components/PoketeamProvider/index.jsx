import React, { createContext, useState } from "react";

export const PokeContext = createContext();

const PoketeamProvider = ({ children }) => {
    const [username, updateUsername] = useState(null);
    const [email, updateEmail] = useState(null);
    const [fname, updateFname] = useState(null);
    const [lname, updateLname] = useState(null);
    const [uid, updateUid] = useState(null);

    const [teams, setTeams] = useState([]);

    const usernameState = { username, updateUsername };
    const emailState = { email, updateEmail };
    const fnameState = { fname, updateFname };
    const lnameState = { lname, updateLname };
    const uidState = { uid, updateUid };

    const teamsState = { teams, setTeams };

    return (
        <PokeContext.Provider
            value={{
                usernameState,
                emailState,
                fnameState,
                lnameState,
                teamsState,
                uidState,
            }}
        >
            {children}
        </PokeContext.Provider>
    );
};

export default PoketeamProvider;
