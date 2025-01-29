import React, { useMemo } from "react";
import PokemonCard from "../PokemonCard";
import type { Pokemon } from "../../types.ts";

interface TeamPokemonGridProps {
    pokemon: Pokemon[];
    limit: number | null;
    onPokeClick: () => void;
    clickableCard: boolean;
    searchCard: boolean;
    sortKey: keyof Pokemon;
    isAscending: boolean;
}

const TeamPokemonGrid = ({
    pokemon,
    limit = null,
    onPokeClick,
    clickableCard = false,
    searchCard = false,
    sortKey = "pid",
    isAscending = true,
}: TeamPokemonGridProps) => {
    if (limit) {
        pokemon = pokemon.slice(0, limit);
    }

    const elements = useMemo(() => {
        return pokemon
            .sort((a, b) => {
                if (typeof a[sortKey] !== "number" || typeof b[sortKey] !== "number") {
                    return isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                }
                return isAscending ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey];
            })
            .map((poke) => (
                <PokemonCard
                    onClick={onPokeClick}
                    key={poke.pid}
                    searchCard={searchCard}
                    pokemon={poke}
                    clickableCard={clickableCard}
                />
            ));
    }, [pokemon]);

    return <div className="flex flex-row flex-wrap justify-center items-center">{elements}</div>;
};

export default TeamPokemonGrid;
