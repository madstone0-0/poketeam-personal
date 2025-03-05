import React from "react";
import { PartialBy, Pokemon } from "../../types";

type PokemonSpriteDisplayProps = {
    pokemon: PartialBy<Pick<Pokemon, "is_shiny" | "sprite_url" | "shiny_sprite_url" | "name">, "is_shiny">;
    className?: string;
};

const PokemonSpriteDisplay = ({ pokemon, className = "" }: PokemonSpriteDisplayProps) => {
    return (
        <img
            style={{
                imageRendering: "pixelated",
            }}
            className={className}
            src={pokemon.is_shiny ? pokemon.shiny_sprite_url : pokemon.sprite_url}
            alt={pokemon.name}
        />
    );
};

export default PokemonSpriteDisplay;
