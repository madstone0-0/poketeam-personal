import React from "react";
import "./index.css";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TeamCard = ({ team, showControls = true, handleDelete = () => {} }) => {
    const navigate = useNavigate();

    const onView = (e) => {
        e.preventDefault();
        navigate(`${team.tid}`);
    };

    return (
        <div className="m-5 w-96 shadow-xl min-h-fit team-card card bg-base-100">
            <div className="card-body">
                <h2 className="card-title">{team.team_name}</h2>
                {showControls ? (
                    <div className="justify-end card-actions">
                        <button className="btn" onClick={onView}>
                            View
                        </button>
                        <button onClick={handleDelete} className="btn btn-error w-fit">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default TeamCard;
