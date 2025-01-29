import React, { useEffect, useState, useCallback, useMemo } from "react";
import { searchPokemon } from "../utils/api";
import Input from "../Input";
import PokemonGrid from "../PokemonGrid";
import { useSnackbar } from "notistack";
import { Pokemon } from "../../types";

interface PokemonPickerProps {
    teamPokemon: Pokemon[];
    pickedPokemon: Set<number>;
    pickPokemon: (arg0: Set<number>) => void;
}

const PokemonPicker = ({ teamPokemon, pickedPokemon, pickPokemon }: PokemonPickerProps) => {
    // const pickerOpen = tempStore((state) => state.pickerOpen, shallow);
    // const searchTerm = tempStore((state) => state.searchTerm, shallow);
    // const setPickerOpen = tempStore((state) => state.setPickerOpen, shallow);
    // const setSearchTerm = tempStore((state) => state.setSearchTerm, shallow);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pokemon, setPokemon] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (searchTerm.length === 0) {
            setPokemon([]);
            return;
        }

        searchPokemon(searchTerm)
            .then((res) => {
                const sortedPokemon = res.toSorted((a, b) => a.name.localeCompare(b.name));
                const pids = teamPokemon.map((poke) => poke.pid);
                const notAlreadyInTeamPokemon = sortedPokemon.filter((poke) => !pids.includes(poke.pid));
                setPokemon(notAlreadyInTeamPokemon);
            })
            .catch((error) => {
                console.error({ error });
            });
    }, [searchTerm]);

    const onPokemonSelect = useCallback(
        (poke) => {
            if (pickedPokemon.size >= 6 || teamPokemon.length >= 6) {
                enqueueSnackbar("Team is full", { variant: "error" });
                return;
            }

            const newPickedPokemon = new Set(pickedPokemon);
            if (newPickedPokemon.has(poke.pid)) {
                newPickedPokemon.delete(poke.pid);
            } else {
                newPickedPokemon.add(poke.pid);
            }

            pickPokemon(newPickedPokemon);
        },
        [pickedPokemon, teamPokemon, enqueueSnackbar, pickPokemon],
    );

    const handleChange = useCallback(
        (e) => {
            setSearchTerm(e.target.value);
        },
        [setSearchTerm],
    );

    const GridProps = useMemo(
        () => ({
            onPokeClick: onPokemonSelect,
            pickedPokemon,
            pokemon,
        }),
        [onPokemonSelect, pickedPokemon, pokemon],
    );

    return (
        <>
            <div
                onClick={(e) => e.stopPropagation()}
                className="self-center p-1 md:p-3 mt-5 w-full  md:w-[95%] rounded-lg collapse bg-base-100"
            >
                <input checked={pickerOpen} onChange={(e) => setPickerOpen(!pickerOpen)} type="checkbox" />
                <h1 className="mb-5 text-3xl text-center collapse-title">Pokemon Picker</h1>
                <div className="collapse-content">
                    <div className="flex justify-center mb-5">
                        <Input
                            type="text"
                            id="search"
                            name="search"
                            placeholder="Search Pokemon"
                            value={searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        {pokemon.length > 0 ? (
                            <PokemonGrid {...GridProps} />
                        ) : (
                            <h2 className="text-xl text-center">No Pokemon Found</h2>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default React.memo(PokemonPicker);
