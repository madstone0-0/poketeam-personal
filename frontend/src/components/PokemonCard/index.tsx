import React, { useState, useEffect } from "react";
import "./index.css";
import TypeBadge from "../TypeBadge";
import "./index.css";
import StatsDisplay from "../StatsDisplay";
import PokemonSpriteDisplay from "../PokemonSpriteDisplay";
import { ClickHandler, PokemonInfo, TeamPokemon } from "../../types";

type PokemonCardProps = {
    pokemon: TeamPokemon | PokemonInfo;
    onClick?: (pokemon: TeamPokemon | PokemonInfo) => void;
    pickedPokemon?: Set<number>;
    searchCard?: boolean;
    clickableCard?: boolean;
};

const PokemonCard = ({
    pokemon,
    onClick = () => {},
    pickedPokemon = new Set(),
    searchCard = true,
    clickableCard = true,
}: PokemonCardProps) => {
    const [clicked, setClicked] = useState(false);
    // const [showStats, setShowStats] = useState(false);

    let name: string;
    let pid: number;
    let type1: string;
    let type2: string | undefined;

    if (searchCard) {
        name = pokemon.name;
        pid = pokemon.pid;
        type1 = pokemon.type1;
        type2 = pokemon.type2;
    } else {
        const poke = pokemon as TeamPokemon;
        name = poke.nickname;
        pid = poke.pid;
        type1 = poke.type1;
        type2 = poke.type2;
    }

    const baseClassName =
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

    const handleOnClick: ClickHandler = (e) => {
        e.preventDefault();
        if (clickableCard || searchCard) {
            setClicked(!clicked);
        }
        onClick(pokemon);
    };

    const renderMain = () => {
        const common = () => (
            <div className="justify-center card-actions">
                <TypeBadge type={type1} />
                {type2 && <TypeBadge type={type2} />}
            </div>
        );

        if (searchCard) {
            return <>{common()}</>;
        } else {
            const level = (pokemon as TeamPokemon).level;
            return (
                <>
                    {common()}
                    <div className="mt-3 mb-3">
                        <h1 className="text-lg text-center">
                            <span className="font-bold">Level: </span> {level}
                        </h1>
                    </div>
                </>
            );
        }
    };

    const renderBottom = () => {
        if (searchCard) {
            return <></>;
        }
        const stats = (pokemon as TeamPokemon).stats;
        return (
            <div className="p-0 mb-0 w-full h-full rounded-b-xl bg-base-300">
                <StatsDisplay stats={stats} />
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
                <h2 className="self-center text-center card-title">
                    {name} <span className="text-sm text-gray-500">#{pid}</span>
                </h2>
                {renderMain()}
            </div>
            {renderBottom()}
        </div>
    );
};

export default PokemonCard;
