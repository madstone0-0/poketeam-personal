import React, { useMemo } from "react";
import PokemonCard from "../PokemonCard";
import { useVirtualizer } from "@tanstack/react-virtual";

const PokemonGrid = ({ pokemon, limit = null, pickedPokemon, onPokeClick }) => {
    if (limit) {
        pokemon = pokemon.slice(0, limit);
    }
    const parentRef = React.useRef(null);

    const rowVirtualizer = useVirtualizer({
        count: 20,
        parentRef,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
    });

    const elements = useMemo(() => {
        return pokemon.map((poke) => (
            <PokemonCard onClick={onPokeClick} key={poke.pid} pokemon={poke} pickedPokemon={pickedPokemon} />
        ));
    }, [pokemon, pickedPokemon]);

    return (
        <div ref={parentRef} style={{ overflow: "auto" }}>
            <div
                className="flex flex-row flex-wrap w-fit"
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {elements}
            </div>
        </div>
    );
};

export default PokemonGrid;
