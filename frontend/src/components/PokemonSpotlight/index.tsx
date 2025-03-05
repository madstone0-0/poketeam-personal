import React, { useEffect, useState } from "react";
import { useUserQueriesAndMutations } from "../utils/queries.js";
import useStore from "../stores/index.js";
import { getTeamInfoById } from "../utils/api.ts";
import MovesDisplay from "../MovesDisplay";
import PokemonSpriteDisplay from "../PokemonSpriteDisplay";
import StatsDisplay from "../StatsDisplay";
import TypeBadge from "../TypeBadge";
import { TeamPokemon } from "../../types.ts";

const PokemonSpotlight = () => {
    const user = useStore((state) => state.user);
    const { uid } = user;
    const { queries } = useUserQueriesAndMutations({ uid: uid! });
    const { teamsQuery } = queries;
    const [pokemon, setPokemon] = useState<TeamPokemon | undefined>();

    useEffect(() => {
        return () => {
            setPokemon(undefined);
        };
    }, []);

    useEffect(() => {
        (async () => {
            teamsQuery.refetch();
            const teams = teamsQuery.data;
            if (teams) {
                if (teams.length === 0) return;
                const tid = teams[Math.floor(Math.random() * teams.length)].tid;
                const teamPokemon = await getTeamInfoById(tid);
                const pokemon = teamPokemon.pokemon[Math.floor(Math.random() * teamPokemon.pokemon.length)];
                setPokemon(pokemon);
            }
        })();
    }, [teamsQuery.data]);

    return (
        <div className="w-full shadow-xl min-h-32 card">
            <div className="card-body">
                <h2 className="text-2xl card-title">Pokemon Spotlight</h2>
                <div className="flex flex-col justify-center mb-5">
                    {pokemon ? (
                        <div className="flex flex-col items-center">
                            <PokemonSpriteDisplay pokemon={pokemon} className="w-52" />
                            <h1 className="mt-2 text-2xl">
                                {pokemon.nickname}
                                <span className="text-sm text-gray-500">({pokemon.name})</span>
                            </h1>
                            <h1 className="text-2xl font-bold">Level: {pokemon.level}</h1>
                            <div className="form-control">
                                <label className="cursor-pointer label">
                                    <span className="mr-4 label-text">Shiny</span>
                                    <input
                                        type="checkbox"
                                        onChange={() => {}}
                                        checked={pokemon.is_shiny}
                                        className="checkbox checkbox-primary"
                                    />
                                </label>
                            </div>
                            <div className="flex flex-row m-3 space-x-2">
                                <TypeBadge type={pokemon.type1} />
                                {pokemon.type2 && <TypeBadge type={pokemon.type2} />}
                            </div>
                            <StatsDisplay stats={pokemon.stats} className="" />
                            <MovesDisplay editMode={false} moves={pokemon.moves} />
                        </div>
                    ) : (
                        <div>No pokemon yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PokemonSpotlight;
