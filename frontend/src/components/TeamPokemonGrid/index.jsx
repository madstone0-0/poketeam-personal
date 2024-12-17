import React, { useMemo } from "react";
import PokemonCard from "../PokemonCard";

const TeamPokemonGrid = ({ pokemon, limit = null, onPokeClick, clickableCard = false, searchCard = false }) => {
    if (limit) {
        pokemon = pokemon.slice(0, limit);
    }

    const elements = useMemo(() => {
        return pokemon.map((poke) => (
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
