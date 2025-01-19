import { readFile, writeFile, rename } from "fs/promises";
import { AGE_TO_UPDATE, CACHE_FILE, POKE_API } from "../constants.js";
import type { CacheTimestampFile, PokemonCacheDB, PromiseReturn, Pokemon, PokemonFetchRes } from "../types.js";
import { formatPokemonName, handleServerError, prettyPrint, ServiceError } from "../utils.js";
import { RateLimit } from "async-sema";
import { customLogger } from "../logging.js";
import db from "../db/db.js";
import _ from "lodash";

class PokemonService {
    async buildCache() {
        let cacheData: CacheTimestampFile = {};

        try {
            cacheData = JSON.parse((await readFile(CACHE_FILE)).toString());
        } catch (e) {}

        console.log(prettyPrint(cacheData));

        const lastCached = cacheData.timestamp ?? null;
        const lastCacheSuccessful = cacheData.success ?? null;

        if (lastCached && lastCacheSuccessful && Date.now() - lastCached < AGE_TO_UPDATE) {
            console.log("Cache is fresh");
            return;
        }

        try {
            const initRes = await fetch(`${POKE_API}/pokemon?limit=1`);
            if (!initRes.ok) throw new ServiceError("Failed to fetch pokemon data", 500);

            const initJson = await initRes.json();
            const totalPokemonCount = initJson.count;

            const res = await fetch(`${POKE_API}/pokemon?limit=${totalPokemonCount}`);
            const allJson = await res.json();

            const pids: number[] = [];
            await db.begin(async (db) => {
                for (const pokemon of allJson.results) {
                    const pid = pokemon.url.split("/")[6];
                    pids.push(pid);
                }
                // Fetch pokemon details in batches
                const pokemonDataBatch = await this.fetchPokemonByIdInParallel(pids, true);
                // cache pokemon data in batches
                const cache = await this.cachePokemonBatch(pokemonDataBatch);
            });

            const tempFile = `${CACHE_FILE}.tmp`;
            await writeFile(tempFile, JSON.stringify({ timestamp: Date.now(), success: true }));
            await rename(tempFile, CACHE_FILE);
            console.log("Finished");
        } catch (e) {
            const tempFile = `${CACHE_FILE}.tmp`;
            await writeFile(tempFile, JSON.stringify({ timestamp: Date.now(), success: false }));
            await rename(tempFile, CACHE_FILE);
        }
    }

    async getCachedPokemon(pid: number): Promise<PokemonCacheDB> {
        const res = await db<PokemonCacheDB[]>`select * from pokemon_cache where pid = ${pid}`;
        return res[0];
    }

    isCacheFresh(pokemon: PokemonCacheDB): boolean {
        if (!pokemon.last_updated) return false;

        try {
            const lastUpdated = new Date(pokemon.last_updated).getTime();
            const currTime = Date.now();
            const interval = (currTime - lastUpdated) / 1000;
            return interval < AGE_TO_UPDATE;
        } catch (e) {
            console.log(`Timestamp parsing error -> ${e}`);
            return false;
        }
    }

    async cachePokemonBatch(pokemon: PokemonCacheDB[]): Promise<boolean> {
        for (const poke of pokemon) {
            try {
                const { name, type1, type2, sprite_url, shiny_sprite_url } = poke;
                await db`
insert into pokemon_cache (pid, name, type1, type2, sprite_url, shiny_sprite_url)
values ${db(poke, "pid", "name", "type1", "type2", "sprite_url", "shiny_sprite_url")}
on conflict (pid) do update
set
name = ${name},
type1 = ${type1 || null},
type2 = ${type2 || null},
sprite_url = ${sprite_url || null},
shiny_sprite_url = ${shiny_sprite_url || null}
`;
            } catch (e) {
                console.log(`Cache error -> ${e}`);
                return false;
            }
        }
        return true;
    }

    async cachePokemon(pokemon: PokemonCacheDB): Promise<boolean> {
        try {
            const { name, type1, type2, sprite_url, shiny_sprite_url } = pokemon;
            await db`
insert into pokemon_cache (pid, name, type1, type2, sprite_url, shiny_sprite_url)
values ${db(pokemon, "pid", "name", "type1", "type2", "sprite_url", "shiny_sprite_url")}
on conflict (pid) do update
set
name = ${name},
type1 = ${type1 || null},
type2 = ${type2 || null},
sprite_url = ${sprite_url || null},
shiny_sprite_url = ${shiny_sprite_url || null}
`;
            return true;
        } catch (e) {
            console.log(`Cache error -> ${e}`);
            return false;
        }
    }

    async fetchPokemonByIdInParallel(pids: number[], cache: boolean = true, batchSize: number = 50, delay = 500) {
        const batches: number[][] = [];
        for (let i = 0; i < pids.length; i += batchSize) {
            batches.push(pids.slice(i, i + Math.min(batchSize, pids.length)));
        }

        const pokemonDataBatch = [];
        let i = 1;
        const limit = RateLimit(30);
        for (const batch of batches) {
            console.log(`[CACHE(${i}/${batches.length})] Fetching batch of ${batch.length} pokemon`);

            const requests: Promise<Response>[] = [];

            for (const pid of batch) {
                const cachedPokemon = await this.getCachedPokemon(pid);
                if (cachedPokemon && this.isCacheFresh(cachedPokemon)) {
                    console.log(`[CACHE (${i}/${batches.length}) Pokemon data ${pid} is fresh]`);
                } else {
                    console.log(`[CACHE (${i}/${batches.length}) Fetching pokemon data ${pid} from API]`);
                    await limit();
                    requests.push(fetch(`${POKE_API}/pokemon/${pid}`));
                }
            }

            for (const res of await Promise.all(requests)) {
                if (!res) {
                    console.log(`[CACHE (${i}/${batches.length}) Unable to fetch pokemon data from API]`);
                    continue;
                }
                const json = await res.json();
                console.log(`[CACHE (${i}/${batches.length}) Fetched pokemon data ${json.id} from API]`);
                const pokemonData: PokemonCacheDB = {
                    pid: json.id,
                    name: formatPokemonName(json.name),
                    type1: json.types[0].type.name,
                    type2: json.types[1]?.type.name,
                    sprite_url: json.sprites.front_default,
                    shiny_sprite_url: json.sprites.front_shiny,
                };

                if (cache) {
                    await this.cachePokemon(pokemonData);
                }

                pokemonDataBatch.push(pokemonData);
            }
            i++;
        }

        return pokemonDataBatch;
    }

    async FromAPIById(pid: number): PromiseReturn<PokemonFetchRes> {
        try {
            const res = await fetch(`${POKE_API}/pokemon/${pid}`);
            if (!res.ok) {
                throw new ServiceError("Failed to fetch pokemon data", 500);
            }
            const json = await res.json();
            const pokemonData: PokemonFetchRes = {
                pid: json.id,
                name: formatPokemonName(json.name),
                type1: json.types[0].type.name,
                type2: json.types[1]?.type.name ?? null,
                sprite_url: json.sprites.front_default,
                shiny_sprite_url: json.sprites.front_shiny,
                stats: json.stats,
                moves: json.moves,
            };

            return {
                status: 200,
                data: pokemonData,
            };
        } catch (e) {
            return handleServerError(e, "GetFromAPIById");
        }
    }

    private async fetchPokemonById(pid: number, cache = true): PromiseReturn<PokemonCacheDB> {
        const cachedPokemon = await this.getCachedPokemon(pid);

        if (cachedPokemon && (await this.isCacheFresh(cachedPokemon))) {
            customLogger(`Pokemon data is fresh`);
            return {
                status: 200,
                data: cachedPokemon,
            };
        }

        customLogger(`Fetching pokemon data from API`);
        const res = await fetch(`${POKE_API}/pokemon/${pid}`);
        if (!res.ok) {
            switch (res.status) {
                case 404:
                    throw new ServiceError("Pokemon not found", 404);
                default:
                    throw new ServiceError("Failed to fetch pokemon data", 500);
            }
        }
        const json = await res.json();
        const pokemonData: PokemonCacheDB = {
            pid: json.id,
            name: formatPokemonName(json.name),
            type1: json.types[0].type.name,
            type2: json.types[1].type.name ?? null,
            sprite_url: json.sprites.front_default,
            shiny_sprite_url: json.sprites.front_shiny,
        };

        if (cache) {
            await this.cachePokemon(pokemonData);
        }
        return {
            status: 200,
            data: pokemonData,
        };
    }

    async ById(pid: number): PromiseReturn<PokemonCacheDB> {
        try {
            const res = await this.fetchPokemonById(pid);
            return {
                status: 200,
                data: res.data,
            };
        } catch (e) {
            return handleServerError(e, "GetById");
        }
    }

    async All(): PromiseReturn<Pokemon[]> {
        try {
            const res = await db<Pokemon[]>`
        select
        	tp.pid,
        	tp.tid,
        	pc.name,
        	tp.nickname,
        	tp."level",
        	tp.is_shiny,
        	pc.type1,
        	pc.type2,
        	pc.sprite_url,
        	pc.shiny_sprite_url,
        	pc.last_updated
        from
        	team_pokemon tp
        inner join pokemon_cache pc on
        	pc.pid = tp.pid
`;
            return {
                status: 200,
                data: res,
            };
        } catch (e) {
            return handleServerError(e, "PokemonAll");
        }
    }

    async ByName(data: { name: string }): PromiseReturn<PokemonCacheDB[]> {
        try {
            const { name } = data;
            const res = await db<
                PokemonCacheDB[]
            >`select * from pokemon_cache where LOWER(name) like ${"%" + name.toLowerCase() + "%"}`;

            return {
                status: 200,
                data: res,
            };
        } catch (e) {
            return handleServerError(e, "Pokemon By Name");
        }
    }
}

export default new PokemonService();
