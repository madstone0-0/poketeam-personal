import React, { useEffect, useState, useCallback } from "react";
import { searchPokemon } from "../utils/api";
import Input from "../Input";
import PokemonGrid from "../PokemonGrid";
import { useSnackbar } from "notistack";
import tempStore from "../stores/tempStore";

const PokemonPicker = ({ teamPokemonNum, pickedPokemon, pickPokemon }) => {
    const pickerOpen = tempStore((state) => state.pickerOpen);
    const searchTerm = tempStore((state) => state.searchTerm);
    const setPickerOpen = tempStore((state) => state.setPickerOpen);
    const setSearchTerm = tempStore((state) => state.setSearchTerm);
    const [pokemon, setPokemon] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (searchTerm.length < 2) {
            setPokemon([]);
            return;
        }

        searchPokemon(searchTerm)
            .then((res) => {
                setPokemon(res);
            })
            .catch((error) => {
                console.error({ error });
            });
    }, [searchTerm]);

    const onPokemonSelect = (poke) => {
        if (pickedPokemon.length >= 6 || teamPokemonNum >= 6) {
            enqueueSnackbar("Team is full", { variant: "error" });
            return;
        }

        const found = pickedPokemon.has(poke.pid);
        if (found) {
            pickedPokemon.delete(poke.pid);
        } else {
            pickPokemon(pickedPokemon.add(poke.pid));
        }
    };

    const handleChange = useCallback(
        (e) => {
            setSearchTerm(e.target.value);
        },
        [setSearchTerm],
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
                            <PokemonGrid
                                onPokeClick={onPokemonSelect}
                                pickedPokemon={pickedPokemon}
                                pokemon={pokemon}
                            />
                        ) : (
                            <h2 className="text-xl text-center">No Pokemon Found</h2>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PokemonPicker;
