import React, { useState, useEffect } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import "./index.css";

const PokemonCard = ({
    pokemon,
    onClick = () => {},
    pickedPokemon = new Set(),
    searchCard = true,
    clickableCard = true,
}) => {
    const [clicked, setClicked] = useState(false);

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

    let baseClassName = "m-5 w-96 h-fit shadow-xl hover:cursor-pointer  pokemon-card card bg-base-200";
    const className = clicked
        ? baseClassName + " border-4 border-primary"
        : baseClassName + " border-4 border-transparent";

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

    const mapTypeToColor = (type) => {
        switch (type) {
            case "normal":
                return "bg-gray-400";
            case "fire":
                return "bg-red-600";
            case "water":
                return "bg-blue-600";
            case "electric":
                return "bg-yellow-600";
            case "grass":
                return "bg-green-600";
            case "ice":
                return "bg-blue-300";
            case "fighting":
                return "bg-red-800";
            case "poison":
                return "bg-purple-600";
            case "ground":
                return "bg-yellow-800";
            case "flying":
                return "bg-blue-400";
            case "psychic":
                return "bg-purple-400";
            case "bug":
                return "bg-green-400";
            case "rock":
                return "bg-yellow-700";
            case "ghost":
                return "bg-purple-800";
            case "dragon":
                return "bg-blue-800";
            case "dark":
                return "bg-gray-800";
            case "steel":
                return "bg-gray-600";
            case "fairy":
                return "bg-pink-400";
            default:
                return "bg-gray-400";
        }
    };

    const formatType = (type) => {
        return type.toUpperCase();
    };

    const renderMain = () => {
        const common = () => (
            <div className="justify-end card-actions">
                <div className={`badge rounded-none text-white badge-outline ${mapTypeToColor(type1)}`}>
                    {formatType(type1)}
                </div>
                {type2 && (
                    <div className={`badge rounded-none  text-white  badge-outline ${mapTypeToColor(type2)}`}>
                        {formatType(type2)}
                    </div>
                )}
            </div>
        );

        if (searchCard) {
            return <>{common()}</>;
        } else {
            return <>{common()}</>;
        }
    };

    return (
        <div onClick={handleOnClick} className={className}>
            <figure>
                <img src={sprite_url} alt={name} />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                {renderMain()}
            </div>
        </div>
    );
};

export default PokemonCard;
