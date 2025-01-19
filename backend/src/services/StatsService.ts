import type { TransactionSql } from "postgres";
import db from "../db/db.js";
import { customLogger } from "../logging.js";
import type { StatFetch, PromiseReturn, PokemonStat, MessageReturn } from "../types.js";
import { handleServerError, isOk, prettyPrint, ServiceError } from "../utils.js";
import PokemonService from "./PokemonService.js";

class StatsService {
    async doesStatsExist(pid: number, tid: number) {
        const res = await db`select tid from stats where tid = ${tid} and pid = ${pid}`;
        return res.length > 0;
    }

    async FetchById(pid: number): PromiseReturn<StatFetch> {
        try {
            const res = await PokemonService.FromAPIById(pid);
            if (!isOk(res.status)) {
                throw new ServiceError("Failed to fetch pokemon data", 500);
            }
            let stats = res.data!.stats;
            const tempPokeStats = stats.map((stat) => {
                const name = stat.stat.name;
                const base = stat.base_stat;
                switch (name) {
                    case "special-defense":
                        return { spdefense: base };
                    case "special-attack":
                        return { spattack: base };
                    default:
                        return { [name]: base };
                }
            });
            const pokeStats: StatFetch = Object.assign({}, ...tempPokeStats);

            return {
                status: 200,
                data: pokeStats,
            };
        } catch (e) {
            return handleServerError(e, "StatsFethcById");
        }
    }

    async Add(stat: PokemonStat, transaction?: TransactionSql): PromiseReturn<{ msg: string }> {
        try {
            if (transaction) {
                const res =
                    await transaction`insert into stats (tid, pid, hp, attack, defense, spattack, spdefense, speed) values ${transaction(stat, "tid", "pid", "hp", "attack", "defense", "spattack", "spdefense", "speed")}`;
            } else {
                const res =
                    await db`insert into stats (tid, pid, hp, attack, defense, spattack, spdefense, speed) values ${db(stat, "tid", "pid", "hp", "attack", "defense", "spattack", "spdefense", "speed")}`;
            }

            return {
                status: 200,
                data: { msg: "Stats added successfully" },
            };
        } catch (e) {
            return handleServerError(e, "StatsAdd");
        }
    }

    async UpdateByPokemon(data: PokemonStat): PromiseReturn<MessageReturn> {
        try {
            const { pid, tid } = data;
            const res = await db`
update stats set ${db(data, "hp", "defense", "attack", "spattack", "spdefense", "speed")}
where pid = ${pid} and tid = ${tid}
`;

            return {
                status: 200,
                data: {
                    msg: "Stats updated successfully",
                },
            };
        } catch (e) {
            return handleServerError(e, "UpdateByPokemon");
        }
    }

    async ById(pid: number, tid: number): PromiseReturn<PokemonStat> {
        try {
            const res = (await db<PokemonStat[]>`select * from stats where pid = ${pid} and tid = ${tid}`)[0];
            return {
                status: 200,
                data: res,
            };
        } catch (e) {
            return handleServerError(e, "StatsById");
        }
    }
}

export default new StatsService();
