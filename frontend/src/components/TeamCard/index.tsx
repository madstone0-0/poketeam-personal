import React from "react";
import "./index.css";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useStore from "../stores";
import { Callback, ClickHandler, Controls, Team, UserTeam } from "../../types";

type TeamCardProps = {
    team: Team | UserTeam;
    showControls?: Controls;
    handleDelete?: ClickHandler;
};

const TeamCard = ({ team, showControls = { view: true, del: true }, handleDelete = () => {} }: TeamCardProps) => {
    const navigate = useNavigate();
    const setSelectedTeam = useStore((state) => state.setSelectedTeam);

    const onView: ClickHandler = (e) => {
        e.preventDefault();
        navigate(`/home/teams/${team.tid}`);
        setSelectedTeam(team.tid);
    };

    return (
        <div className="m-5 w-96 shadow-xl min-h-fit team-card card bg-base-100">
            <div className="card-body">
                <h2 className="card-title">{team.teamName}</h2>
                {showControls.view || showControls.del ? (
                    <div className="justify-end card-actions">
                        {showControls.view ? (
                            <button className="btn" onClick={onView}>
                                View
                            </button>
                        ) : (
                            <></>
                        )}
                        {showControls.del ? (
                            <button onClick={handleDelete} className="btn btn-error w-fit">
                                <Trash2 size={20} />
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default TeamCard;
