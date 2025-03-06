import React, { useState, useEffect, useReducer, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "../stores";
import { useForm } from "@tanstack/react-form";
import StatsDisplay from "../StatsDisplay";
import { Save } from "lucide-react";
import MovesDisplay from "../MovesDisplay";
import TypeBadge from "../TypeBadge";
import Input from "../Input";
import { mapStatToIcon } from "../utils/helpers";
import { useSnackbar } from "notistack";
import { useSettings } from "../utils/hooks";
import { useUserQueriesAndMutations } from "../utils/queries";
import PokemonSpriteDisplay from "../PokemonSpriteDisplay";
import withLoading from "../WithLoading";
import MovesPicker from "../MovesPicker";
import { ClickHandler, Move, TeamPokemon, TeamPokemonMove, TeamPokemonStat, UpdatePokemon } from "../../types";

type PokemonSingleProps = {
    selectedPokemon?: TeamPokemon;
};

const PokemonSingle = ({ selectedPokemon }: PokemonSingleProps) => {
    const nav = useNavigate();
    const setSelectedPokemon = useStore((state) => state.setSelectedPokemon);
    const selectedTeam = useStore((state) => state.selectedTeam);
    const user = useStore((state) => state.user);
    const uid = user.uid;
    const tid = useParams().tid;
    const [moves, setMoves] = useState<TeamPokemonMove[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const { options } = useSettings();
    const [loading, setLoading] = useState(false);

    const [editMode, setEditMode] = useReducer((editMode) => !editMode, false);

    const { queries, mutations } = useUserQueriesAndMutations({ uid: uid!, tid: selectedTeam });
    const { teamPokemonQuery } = queries;
    const { teamUpdatePokemonMutation } = mutations;

    useEffect(() => {
        if (selectedPokemon) {
            setMoves(selectedPokemon.moves);
        }

        if (!selectedPokemon) {
            nav(-1);
        }

        return () => {};
    }, []);

    useEffect(() => {
        if (selectedPokemon) {
            setMoves(selectedPokemon.moves);
        }

        if (!selectedPokemon) {
            nav(-1);
        }
    }, [selectedPokemon]);

    const onBack: ClickHandler = (e) => {
        e.preventDefault();
        if (selectedPokemon && editMode) {
            setMoves(selectedPokemon.moves);
            toggleEditMode();
            return;
        }
        nav(-1);
    };

    const toggleEditMode = () => {
        setEditMode();
    };

    const handleButtonClick: ClickHandler = async (e) => {
        toggleEditMode();
    };

    const form = useForm<EditablePokemon>({
        defaultValues: {
            nickname: selectedPokemon ? selectedPokemon.nickname : "",
            level: selectedPokemon ? selectedPokemon.level : options.defaultLevel,
            stats: selectedPokemon ? selectedPokemon.stats : [],
            is_shiny: selectedPokemon ? selectedPokemon.is_shiny : false,
        },
        onSubmit: async ({ value }) => {
            await onSaveChanges(value);
        },
    });

    if (!selectedPokemon) return <></>;

    type EditablePokemon = Pick<TeamPokemon, "nickname" | "level" | "stats" | "is_shiny">;

    const onSaveChanges = async (value: EditablePokemon) => {
        setLoading(true);
        if (value.nickname === "") {
            enqueueSnackbar("Nickname cannot be empty", { variant: "error" });
            setLoading(false);
            return;
        }

        if (value.stats.some((stat) => stat.value < 0)) {
            enqueueSnackbar("Stats cannot be less than 0", { variant: "error" });
            setLoading(false);
            return;
        }

        if (value.level > 100 || value.level < 1) {
            enqueueSnackbar("Level must be between 1 and 100", { variant: "error" });
            setLoading(false);
            return;
        }

        const data: UpdatePokemon = {
            tid: parseInt(tid!),
            pokemon: {
                pid: selectedPokemon.pid,
                is_shiny: value.is_shiny,
                nickname: value.nickname,
                level: value.level,
                stats: value.stats,
                moves: moves,
            },
        };

        try {
            await teamUpdatePokemonMutation.mutateAsync(data);
            teamPokemonQuery.refetch();
            setSelectedPokemon({ ...selectedPokemon, ...data.pokemon });
            toggleEditMode();
            setLoading(false);
        } catch (e) {
            console.error({ e });
            setLoading(false);
        }
    };

    const EditForm = () => {
        if (!selectedPokemon) return <></>;

        return (
            <form
                id="editForm"
                className="flex flex-col items-center w-full h-full form-control"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <>
                    <div className="fixed right-4 bottom-4 z-50 w-max h-max">
                        <button
                            type="submit"
                            className="p-4 w-max font-bold text-black rounded-badge h-max btn btn-primary"
                        >
                            <Save size={50} />
                        </button>
                    </div>

                    <PokemonSpriteDisplay pokemon={selectedPokemon} className="w-72" />

                    <form.Field
                        name="nickname"
                        children={(field) => (
                            <>
                                <Input
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                                <span className="text-sm text-gray-500">
                                    #{selectedPokemon.pid} ({selectedPokemon.name})
                                </span>
                            </>
                        )}
                    />

                    <form.Field
                        name="level"
                        children={(field) => (
                            <Input
                                Icon={() => (
                                    <>
                                        <span className="font-bold">Level</span>
                                    </>
                                )}
                                className="w-fit"
                                inputExtra={[{ min: 1, max: 100 }]}
                                type="number"
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(parseInt(e.target.value))}
                            />
                        )}
                    />

                    <form.Field
                        name="is_shiny"
                        children={(field) => (
                            <label className="cursor-pointer label">
                                <span className="mr-4 label-text">Shiny</span>
                                <input
                                    type="checkbox"
                                    checked={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.checked)}
                                    className="checkbox checkbox-primary"
                                />
                            </label>
                        )}
                    />

                    <div className="flex flex-row m-3 space-x-2">
                        <TypeBadge type={selectedPokemon.type1} />
                        {selectedPokemon.type2 && <TypeBadge type={selectedPokemon.type2} />}
                    </div>
                    <form.Field
                        mode="array"
                        name="stats"
                        children={(field) => (
                            <div className="p-5 m-0 mb-2 w-full h-full">
                                {field.state.value.map((_, key) => {
                                    return (
                                        <form.Field
                                            validators={{
                                                onChange: ({ value }) => {
                                                    const val = value as unknown as TeamPokemonStat;
                                                    console.log({ val });
                                                    return val.value < 0 ? "Stat cannot be less than 0" : undefined;
                                                },
                                            }}
                                            key={key}
                                            // @ts-expect-error tanstack hack to work with whole objects instead of fields
                                            name={`stats[${key}]`}
                                        >
                                            {(subField) => {
                                                const val = subField.state.value as unknown as TeamPokemonStat;
                                                return (
                                                    <div key={key} className="flex justify-between">
                                                        {mapStatToIcon(val.name)}
                                                        <div className="flex flex-col">
                                                            <Input
                                                                inputExtra={[{ min: 0, max: 999999 }]}
                                                                type="number"
                                                                name={val.name}
                                                                value={val.value}
                                                                onChange={(e) =>
                                                                    subField.handleChange({
                                                                        // @ts-expect-error tanstack hack to work with whole objects instead of fields
                                                                        name: val.name,
                                                                        value: e.target.valueAsNumber,
                                                                    })
                                                                }
                                                            />
                                                            {field.state.meta.errors ? (
                                                                <em role="alert">
                                                                    {field.state.meta.errors.join(", ")}
                                                                </em>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }}
                                        </form.Field>
                                    );
                                })}
                            </div>
                        )}
                    />
                </>
            </form>
        );
    };

    const onMoveClick = (move: Move) => {
        setMoves(moves.filter((m) => m.mid !== move.mid));
    };

    type RenderMainProps = {
        moves: TeamPokemonMove[];
        editMode: boolean;
        selectedPokemon?: TeamPokemon;
    };
    const RenderMain = memo(({ moves, editMode, selectedPokemon }: RenderMainProps) => {
        if (!selectedPokemon) return;

        if (editMode) {
            return (
                <div className="flex flex-col">
                    <EditForm />
                    <MovesPicker pid={selectedPokemon.pid} moves={moves} pickMove={setMoves} />
                    <h1 className="m-4 text-xl font-bold text-center md:text-3xl">
                        Click a move to remove it from your pokemon
                    </h1>
                    <MovesDisplay editMode={editMode} onClick={onMoveClick} moves={moves} />
                </div>
            );
        }

        return (
            <>
                <PokemonSpriteDisplay pokemon={selectedPokemon} className="w-72" />
                <h1 className="mt-2 text-2xl">
                    {selectedPokemon.nickname}{" "}
                    <span className="text-sm text-gray-500">
                        #{selectedPokemon.pid} ({selectedPokemon.name})
                    </span>
                </h1>
                <h1 className="text-2xl font-bold">Level: {selectedPokemon.level}</h1>
                <div className="form-control">
                    <label className="cursor-pointer label">
                        <span className="mr-4 label-text">Shiny</span>
                        <input
                            type="checkbox"
                            onChange={() => {}}
                            checked={selectedPokemon.is_shiny}
                            className="checkbox checkbox-primary"
                        />
                    </label>
                </div>
                <div className="flex flex-row m-3 space-x-2">
                    <TypeBadge type={selectedPokemon.type1} />
                    {selectedPokemon.type2 && <TypeBadge type={selectedPokemon.type2} />}
                </div>
                <StatsDisplay stats={selectedPokemon.stats} className="" />
                <MovesDisplay editMode={editMode} moves={moves} />
            </>
        );
    });

    return withLoading(() => (
        <div className="flex flex-col justify-center mb-5 w-full">
            <div className="flex flex-row justify-between mb-4 w-full">
                <button
                    className={`py-2 px-4 ${editMode ? "w-full" : "w-[48%]"} text-lg font-bold text-black rounded btn btn-accent`}
                    onClick={onBack}
                >
                    {editMode ? "Cancel" : "Back"}
                </button>
                {!editMode && (
                    <button
                        form="editForm"
                        onClick={handleButtonClick}
                        className={`py-2 px-4  w-[48%] text-lg font-bold text-black rounded btn btn-primary`}
                    >
                        Edit
                    </button>
                )}
            </div>
            {selectedPokemon != null && (
                <div className="flex flex-col items-center">
                    <RenderMain moves={moves} editMode={editMode} selectedPokemon={selectedPokemon} />
                </div>
            )}
        </div>
    ))({ loading });
};

export default PokemonSingle;
