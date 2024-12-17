import React, { useState, useEffect } from "react";
import "./index.css";
import TypeBadge from "../TypeBadge";
import "./index.css";
import StatsDisplay from "../StatsDisplay";
import PokemonSpriteDisplay from "../PokemonSpriteDisplay";

const PokemonCard = ({
    pokemon,
    onClick = () => {},
    pickedPokemon = new Set(),
    searchCard = true,
    clickableCard = true,
}) => {
    const [clicked, setClicked] = useState(false);
    const [showStats, setShowStats] = useState(false);

    let name;
    let pid;
    let type1;
    let type2;
    let sprite_url;

    if (searchCard) {
        name = pokemon.name;
        pid = pokemon.pid;
        type1 = pokemon.type1;
        type2 = pokemon.type2;
        sprite_url = pokemon.sprite_url;
    } else {
        name = pokemon.nickname;
        pid = pokemon.pid;
        type1 = pokemon.type1;
        type2 = pokemon.type2;
        sprite_url = pokemon.sprite_url;
    }

    let baseClassName =
        "m-5 w-[70vw] md:w-96 h-fit shadow-xl hover:cursor-pointer rounded-xl card-compact pokemon-card card bg-base-100";
    let className = baseClassName;
    if (searchCard) {
        className = clicked ? className + " border-4 border-primary" : className + " border-4 border-transparent";
    } else {
        className = className + " border-0 border-transparent";
    }

    useEffect(() => {
        if (pickedPokemon.has(pid)) {
            setClicked(true);
        }
    }, [pickedPokemon]);

    const handleOnClick = (e) => {
        e.preventDefault();
        if (clickableCard || searchCard) {
            setClicked(!clicked);
        }
        onClick(pokemon);
    };

    const renderMain = () => {
        const common = () => (
            <div className="justify-end card-actions">
                <TypeBadge type={type1} />
                {type2 && <TypeBadge type={type2} />}
            </div>
        );

        if (searchCard) {
            return <>{common()}</>;
        } else {
            return (
                <>
                    {common()}
                    <div className="mt-3 mb-3">
                        <h1 className="text-center">Level: {pokemon.level}</h1>
                    </div>
                </>
            );
        }
    };

    const renderBottom = () => {
        if (searchCard) {
            return <></>;
        }
        return (
            <div className="p-0 mb-0 w-full h-full rounded-b-xl bg-base-300">
                <StatsDisplay stats={pokemon.stats} />
            </div>
        );
    };

    if (pokemon === null) {
        return <></>;
    }

    return (
        <div onClick={handleOnClick} className={className}>
            <figure>
                <PokemonSpriteDisplay className="w-1/2" pokemon={pokemon} />
            </figure>
            <div className="pb-0 mb-0 card-body">
                <h2 className="self-center text-center card-title">{name}</h2>
                {renderMain()}
            </div>
            {renderBottom()}
        </div>
    );
};

export default PokemonCard;
