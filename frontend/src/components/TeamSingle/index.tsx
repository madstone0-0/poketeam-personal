import React, { useEffect, useState, useReducer, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPokemonById } from "../utils/api";
import { useSnackbar } from "notistack";
import PokemonPicker from "../PokemonPicker";
import withLoading from "../WithLoading";
import { useQueryClient } from "react-query";
import TeamPokemonGrid from "../TeamPokemonGrid";
import Input from "../Input";
import useStore from "../stores";
import { useUserQueriesAndMutations } from "../utils/queries";
import { useSettings } from "../utils/hooks";
import {
    Callback,
    ClickHandler,
    NewTeamPokemon,
    PokemonInfo,
    Team,
    TeamInfo,
    TeamPokemon,
    TID,
    UID,
} from "../../types";

const TeamSingle = () => {
    const { tid } = useParams();
    const [team, setTeam] = useState<TeamInfo["team"]>();
    const [pokemon, setPokemon] = useState<TeamPokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [pickedPokemon, pickPokemon] = useState(new Set(pokemon.map((poke) => poke.pid)));
    const user = useStore((state) => state.user);
    const { uid } = user;
    const { queries } = useUserQueriesAndMutations({ uid: uid!, tid: parseInt(tid!) });
    const { teamPokemonQuery } = queries;
    const [editTeamName, setTeamName] = useState(team?.teamName);
    const [teamName, setMainTeamName] = useState("");
    const teamNameState = { editTeamName, setTeamName };
    const queryClient = useQueryClient();

    useEffect(() => {
        teamPokemonQuery.refetch();
        if (teamPokemonQuery.isSuccess) {
            setTeam(teamPokemonQuery.data.team);
            setMainTeamName(teamPokemonQuery.data.team.teamName);
            setTeamName(teamPokemonQuery.data.team.teamName);
            setPokemon(teamPokemonQuery.data.pokemon);
            setLoading(false);
        }

        return () => {
            queryClient.cancelQueries({ queryKey: ["teamPokemon"] });
        };
    }, []);

    const selectedPokemon = useStore((state) => state.selectedPokemon);
    const setSelectedPokemon = useStore((state) => state.setSelectedPokemon);

    useEffect(() => {
        // teamPokemonQuery.refetch();
        if (teamPokemonQuery.isSuccess && teamPokemonQuery.data) {
            setTeam(teamPokemonQuery.data.team);
            setMainTeamName(teamPokemonQuery.data.team.teamName);
            setTeamName(teamPokemonQuery.data.team.teamName);
            setPokemon(teamPokemonQuery.data.pokemon);
            if (selectedPokemon != null) {
                const found = teamPokemonQuery.data.pokemon.find((poke) => poke.pid === selectedPokemon.pid);
                if (found) {
                    setSelectedPokemon(found);
                }
            }
            setLoading(false);
        }

        return () => {
            queryClient.cancelQueries({ queryKey: ["teamPokemon"] });
        };
    }, [teamPokemonQuery.data]);

    return withLoading(TeamSingleView)({
        teamNameState,
        tid: parseInt(tid!),
        uid,
        teamName,
        pokemon,
        loading,
        pickedPokemon,
        pickPokemon,
        setMainTeamName,
    });
};

type TeamSingleViewProps = {
    teamNameState: {
        editTeamName: string | undefined;
        setTeamName: React.Dispatch<React.SetStateAction<string | undefined>>;
    };
    uid: UID;
    tid: TID;
    teamName: string;
    setMainTeamName: React.Dispatch<React.SetStateAction<string>>;
    pokemon: TeamPokemon[];
    pickedPokemon: Set<number>;
    pickPokemon: React.Dispatch<React.SetStateAction<Set<number>>>;
};

const TeamSingleView = ({
    teamNameState,
    tid,
    uid,
    teamName,
    setMainTeamName,
    pokemon,
    pickedPokemon,
    pickPokemon,
}: TeamSingleViewProps) => {
    const nav = useNavigate();
    const [editMode, setEditMode] = useReducer((editMode) => !editMode, false);
    const [deletePokemon, setDeletePokemon] = useState(new Set<number>([]));
    const { enqueueSnackbar } = useSnackbar();
    const [shownPokemon, setShownPokemon] = useState(pokemon);
    const { queries, mutations } = useUserQueriesAndMutations({ tid, uid });
    const { teamPokemonQuery } = queries;
    const { teamAddPokemonMutation, teamDeleteManyPokemonMutation, teamUpdateMutation } = mutations;
    const { editTeamName, setTeamName } = teamNameState;
    const { options } = useSettings();

    const setSelectedPokemon = useStore((state) => state.setSelectedPokemon);

    const toggleEditMode = () => {
        setEditMode();
    };

    const handleButtonClick: ClickHandler = async (e) => {
        if (editMode) {
            await onSaveChanges(e);
            return;
        }

        toggleEditMode();
    };

    const handleDiscard: ClickHandler = (e) => {
        e.preventDefault();
        pickPokemon(new Set());
        setDeletePokemon(new Set());
        setShownPokemon(pokemon);
        toggleEditMode();
    };

    const onSaveChanges: ClickHandler = async (e) => {
        e.preventDefault();

        if (!editTeamName) return;

        // Change team name first
        const oldTeamName = teamName;
        if (oldTeamName !== editTeamName) {
            try {
                const teamData = { id: tid, name: editTeamName };
                await teamUpdateMutation.mutateAsync(teamData);
                setMainTeamName(editTeamName);
            } catch (e) {
                console.error({ e });
                const err = e as Error;
                enqueueSnackbar(err.message, { variant: "error" });
                return;
            }
        }

        // Then delete pokemon
        if (deletePokemon.size > 0) {
            try {
                const data = { tid, pids: Array.from(deletePokemon) };
                await teamDeleteManyPokemonMutation.mutateAsync(data);
                setDeletePokemon(new Set());
                setShownPokemon(pokemon.filter((poke) => !deletePokemon.has(poke.pid)));
                teamPokemonQuery.refetch();
            } catch (e) {
                console.error({ e });
                const err = e as Error;
                enqueueSnackbar(err.message, { variant: "error" });
                return;
            }
        }

        // Then add pokemon
        if (pickedPokemon.size > 0) {
            if (pickedPokemon.size > 6) {
                enqueueSnackbar("Too many Pokemon selected max number is 6", { variant: "error" });
                return;
            }

            const data: NewTeamPokemon = { tid, pokemon: [] };
            for (const pid of pickedPokemon) {
                const pokeInfo = await getPokemonById(pid);
                data.pokemon.push({
                    pid: pid,
                    nickname: pokeInfo.name,
                    level: options.defaultLevel,
                    is_shiny: false,
                });
            }

            try {
                await teamAddPokemonMutation.mutateAsync(data);
                pickPokemon(new Set());
                teamPokemonQuery.refetch();
                toggleEditMode();
                return;
            } catch (e) {
                console.error({ e });
                pickPokemon(new Set());
                const err = e as Error
                enqueueSnackbar(err.message, { variant: "error" });
                return;
            }
        }

        toggleEditMode();
    };

    useEffect(() => {
        setShownPokemon(pokemon.filter((poke) => !deletePokemon.has(poke.pid)));
    }, [deletePokemon, pokemon]);

    const deleteOnPokeClick: Callback<[TeamPokemon | PokemonInfo]> = (poke) => {
        if (deletePokemon.has(poke.pid)) {
            setDeletePokemon((prev) => {
                const newSet = new Set(prev);
                newSet.delete(poke.pid);
                return newSet;
            });
        } else {
            setDeletePokemon((prev) => new Set(prev).add(poke.pid));
        }
    };

    const shownMemo = useMemo(() => shownPokemon, [shownPokemon]);
    const pickedMemo = useMemo(() => pickedPokemon, [pickedPokemon]);

    const onTeamPokemonClick: Callback<[TeamPokemon]> = (poke) => {
        setSelectedPokemon(poke);
        nav(`pokemon/${poke.pid}`);
    };

    const RenderMain = useMemo(() => {
        const loading = teamAddPokemonMutation.isLoading || teamDeleteManyPokemonMutation.isLoading;

        // Edit mode rendering
        if (editMode) {
            return (
                <div className="flex flex-col">
                    {loading ? (
                        <div className="flex justify-center items-center w-full h-screen">
                            <span className="loading loading-dots loading-lg"></span>
                        </div>
                    ) : (
                        <>
                            <PokemonPicker
                                teamPokemon={shownPokemon}
                                pickedPokemon={pickedMemo}
                                pickPokemon={pickPokemon}
                            />
                            <h1 className="m-4 text-xl font-bold text-center md:text-3xl">
                                Click a Pokemon to remove it from your team
                            </h1>
                            <TeamPokemonGrid clickableCard={true} onPokeClick={deleteOnPokeClick} pokemon={shownMemo} />
                        </>
                    )}
                </div>
            );
        }

        // Non-edit mode rendering
        if (pokemon.length === 0) {
            return (
                <div className="p-5 font-bold text-center align-middle h-[100vh]">
                    <span>No Pokemon in this team</span>
                </div>
            );
        }

        // Default case: show team pokemon grid
        return <TeamPokemonGrid onPokeClick={onTeamPokemonClick} clickableCard={true} pokemon={pokemon} />;
    }, [
        editMode,
        shownMemo,
        pickedMemo,
        pokemon,
        teamAddPokemonMutation.isLoading,
        teamDeleteManyPokemonMutation.isLoading,
    ]);

    return (
        <div className="flex flex-col self-center">
            {editMode ? (
                <Input
                    type="text"
                    id="teamName"
                    name="teamName"
                    onChange={(e) => setTeamName(e.target.value)}
                    value={editTeamName}
                />
            ) : (
                <h1 className="mb-5 text-4xl font-bold text-center">{teamName}</h1>
            )}
            <div className="flex flex-col justify-center items-center self-center w-1/2 md:flex-row">
                <button
                    disabled={
                        teamPokemonQuery.isLoading ||
                        teamAddPokemonMutation.isLoading ||
                        teamDeleteManyPokemonMutation.isLoading
                    }
                    onClick={handleButtonClick}
                    className={`m-2 w-full ${!editMode ? "self-center" : ""} text-sm md:m-5 md:w-1/2 md:text-lg btn btn-primary`}
                >
                    {editMode ? "Save Changes" : "Edit Team"}
                </button>
                {editMode ? (
                    <button
                        disabled={
                            teamPokemonQuery.isLoading ||
                            teamAddPokemonMutation.isLoading ||
                            teamDeleteManyPokemonMutation.isLoading
                        }
                        onClick={handleDiscard}
                        className="m-2 w-full text-sm md:m-5 md:w-1/2 md:text-lg btn btn-accent"
                    >
                        Discard Changes
                    </button>
                ) : (
                    <></>
                )}
            </div>
            {RenderMain}
        </div>
    );
};

export default TeamSingle;
