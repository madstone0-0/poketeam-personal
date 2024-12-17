import React, { useState, useEffect } from "react";
import TeamGrid from "../TeamGrid";
import useStore from "../stores";
import { useUserQueriesAndMutations } from "../utils/queries";

const TeamPage = () => {
    const user = useStore((state) => state.user);
    const { uid } = user;
    const [teams, setTeams] = useState([]);

    const { queries, mutations } = useUserQueriesAndMutations({ uid });
    const { teamsQuery } = queries;

    useEffect(() => {
        if (teamsQuery.data) {
            setTeams(teamsQuery.data);
        }
    }, []);

    useEffect(() => {
        if (teamsQuery.data) {
            setTeams(teamsQuery.data);
        }
    }, [teamsQuery.data]);

    return <TeamGrid teams={teams} />;
};

export default TeamPage;
