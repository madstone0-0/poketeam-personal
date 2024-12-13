import React from "react";
import TeamGrid from "../TeamGrid";
import { usePoke } from "../utils/hooks";

const TeamPage = () => {
    const { teamsState } = usePoke();
    const { teams } = teamsState;

    return <TeamGrid teams={teams} />;
};

export default TeamPage;
