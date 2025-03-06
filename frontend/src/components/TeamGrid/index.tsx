import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TeamCard from "../TeamCard";
import { useUserQueriesAndMutations } from "../utils/queries";
import Modal from "../Modal";
import Input from "../Input";
import { useForm } from "@tanstack/react-form";
import useStore from "../stores";
import { Controls, Team, UserTeam } from "../../types";

export type TeamGridProps = {
    teams: UserTeam[];
    limit?: number;
    showControls?: Controls;
    sortBy?: (a: UserTeam, b: UserTeam) => number;
};

const TeamGrid = ({
    teams,
    limit = undefined,
    showControls = { create: true, view: true, del: true },
    sortBy = undefined,
}: TeamGridProps) => {
    const user = useStore((state) => state.user);
    const { uid } = user;
    const [displayTeams, setDisplayTeams] = useState<UserTeam[]>(teams);

    const { mutations } = useUserQueriesAndMutations({ uid: uid!, tid: undefined });
    const { teamDeleteMutation, teamCreateMutation } = mutations;
    // const [teams, setTeams] = useState([]);

    if (limit) {
        if (teams.length > limit) {
            teams = teams.slice(0, limit);
        }
    }

    useEffect(() => {
        if (sortBy) {
            setDisplayTeams(displayTeams.sort((a, b) => sortBy(a, b)));
        }
    }, []);

    const onDelete = async (team: UserTeam) => {
        try {
            await teamDeleteMutation.mutateAsync(team.tid);
        } catch (e) {
            console.error({ e });
        }
    };

    const handleDelete = <T extends React.UIEvent>(e: T, callback: () => void) => {
        e.preventDefault();
        const modal = document.getElementById("confirmDeleteModal")! as HTMLDialogElement;
        const deleteButton = modal.querySelector("#deleteButton")! as HTMLButtonElement;
        const cancelButton = modal.querySelector("#cancelButton")! as HTMLButtonElement;

        deleteButton.onclick = () => {
            modal.close();
            callback();
        };

        cancelButton.onclick = () => {
            modal.close();
        };

        modal.showModal();
    };

    const handleCreate = <T extends React.UIEvent>(e: T) => {
        e.preventDefault();
        const modal = document.getElementById("createTeamModal")! as HTMLDialogElement;
        const cancelButton = modal.querySelector("#cancelButton")! as HTMLButtonElement;

        cancelButton.onclick = () => {
            modal.close();
        };

        modal.showModal();
    };

    const form = useForm<Pick<Team, "teamName">>({
        defaultValues: {
            teamName: "",
        },

        onSubmit: async ({ value }) => {
            const modal = document.getElementById("createTeamModal") as HTMLDialogElement;
            try {
                await teamCreateMutation.mutateAsync({ id: uid!, name: value.teamName });
                value.teamName = "";
                modal.close();
            } catch (e) {
                console.error({ e });
            }
        },
    });

    return (
        <div className="flex flex-col">
            {showControls.create ? (
                <button onClick={handleCreate} className="text-xl btn btn-primary">
                    Create Team
                </button>
            ) : (
                <></>
            )}
            <div className="flex flex-row flex-wrap">
                {teams.map((team, key) => (
                    <TeamCard
                        key={key}
                        handleDelete={(e) => handleDelete(e, async () => await onDelete(team))}
                        team={team}
                        showControls={showControls}
                    />
                ))}
            </div>
            {createPortal(
                <Modal id="confirmDeleteModal" title="Are you Sure?">
                    <p className="py-4">Are you sure you want to delete this team?</p>
                    <div className="modal-action">
                        <button id="deleteButton" className="btn btn-error">
                            Delete
                        </button>
                        <button id="cancelButton" className="btn btn-ghost">
                            Cancel
                        </button>
                    </div>
                </Modal>,
                document.body,
            )}
            {createPortal(
                <Modal id="createTeamModal" title="Create Team">
                    <form
                        className="form-control"
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                    >
                        <div>
                            <form.Field
                                name="teamName"
                                children={(field) => (
                                    <Input
                                        Icon={() => <h1 className="font-bold">Team Name</h1>}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-row justify-between modal-action">
                            <button className="w-1/2 btn btn-error" type="submit">
                                Create
                            </button>
                            <button type="reset" id="cancelButton" className="w-1/2 btn btn-ghost">
                                Cancel
                            </button>
                        </div>
                    </form>
                </Modal>,
                document.body,
            )}
        </div>
    );
};

export default TeamGrid;
