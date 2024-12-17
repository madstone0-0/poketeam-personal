import React from "react";

const PokemonSpriteDisplay = ({ pokemon, className = "" }) => {
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
