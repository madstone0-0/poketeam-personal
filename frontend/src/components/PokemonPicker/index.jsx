import React, { useEffect, useState } from "react";
import { searchPokemon } from "../utils/api";
import Input from "../Input";
import PokemonGrid from "../PokemonGrid";
import { useSnackbar } from "notistack";

const PokemonPicker = ({ teamPokemon, pickedPokemon, pickPokemon }) => {
    const [pokemon, setPokemon] = useState([]);
    const [checked, setChecked] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (searchTerm === "") {
            setPokemon([]);
            return;
        }

        searchPokemon(searchTerm)
            .then((res) => {
                console.log({ res });
                setPokemon(res);
            })
            .catch((error) => {
                console.error({ error });
            });
    }, [searchTerm]);

    const onPokemonSelect = (poke) => {
        if (pickedPokemon.length >= 6 || teamPokemon.length >= 6) {
            enqueueSnackbar("Team is full", { variant: "error" });
            return;
        }

        const found = pickedPokemon.has(poke.pid);
        if (found) {
            pickedPokemon.delete(poke.pid);
        } else {
            pickPokemon(pickedPokemon.add(poke.pid));
        }
        console.log({ pickedPokemon });
    };

    return (
        <>
            <div className="self-center p-5 mt-5 w-[90%] rounded-lg collapse bg-base-100">
                <input value={checked} onChange={() => setChecked(!checked)} type="checkbox" />
                <h1 className="mb-5 text-3xl text-center collapse-title">Pokemon Picker</h1>
                <div className="collapse-content">
                    <div className="flex justify-center mb-5">
                        <Input
                            type="text"
                            id="search"
                            name="search"
                            placeholder="Search Pokemon"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
