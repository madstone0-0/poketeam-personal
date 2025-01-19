import db from "../db/db.js";
import { customLogger } from "../logging.js";
import {
    type PromiseReturn,
    type AllTeamData,
    type TeamData,
    type NewTeam,
    type ManyNewTeamPokemon,
    type NewTeamPokemon,
    type NewPokemon,
    type PokemonStat,
    type TeamPokemon,
    type TeamPokemonDB,
    type MessageReturn,
    type UpdatePokemon,
    type Pokemon,
} from "../types.js";
import { handleServerError, isOk, mapTeamPokemonToStatFetch, prettyPrint, ServiceError } from "../utils.js";
import UserService from "./UserService.js";
import StatsService from "./StatsService.js";
import MovesService from "./MovesService.js";

class TeamService {
    private async doesTeamExist(id: number) {
        const res = await db`select tid from team where tid = ${id}`;
        return res.length > 0;
    }

    private async updateLastUpdated(id: number) {
        await db`update team set updated_at = now() where tid = ${id}`;
    }

    private async doesPokemonExistInTeam(tid: number, pid: number) {
        const res = await db`select tid from team_pokemon where tid = ${tid} and pid = ${pid}`;
        return res.length > 0;
    }

    async All(): PromiseReturn<AllTeamData[]> {
        try {
            const res = await db<{ json_build_object: AllTeamData }[]>`select
    json_build_object(
        'tid',
        t.tid,
        'teamName',
        t.team_name,
        'uid',
        t.uid,
        'createdAt',
        t.created_at,
        'updatedAt',
        t.updated_at,
        'user',
        json_build_object(
            'username',
            u.username,
            'email',
            u.email ,
            'fname',
            u.fname,
            'lname',
            u.lname
        )
    )
from
    team t
inner join "user" u on
    u.uid = t.uid
`;
            const data: AllTeamData[] = res.map((i) => i.json_build_object);

            return {
                status: 200,
                data,
            };
        } catch (e) {
            return handleServerError(e, "TeamAll");
        }
    }

    async ByUID(uid: number): PromiseReturn<TeamData[]> {
        try {
            if (!(await UserService.doesUserExist(undefined, uid))) {
                throw new ServiceError("User not found", 404);
            }

            type TeamDB = {
                tid: number;
                team_name: string;
                uid: number;
                created_at: string;
                updated_at: string;
            };

            const res = await db<TeamDB[]>`select
        	*
        from
        	team
        where uid = ${uid} `;
            const data: TeamData[] = [];
            for (const team of res) {
                data.push({
                    tid: team.tid,
                    teamName: team.team_name,
                    uid: team.uid,
                    createdAt: team.created_at,
                    updatedAt: team.updated_at,
                });
            }

            return {
                status: 200,
                data: data,
            };
        } catch (e) {
            return handleServerError(e, "Team All By UID");
        }
    }

    async ById(tid: number): PromiseReturn<TeamData> {
        try {
            if (!(await this.doesTeamExist(tid))) {
                throw new ServiceError("Team not found", 404);
            }

            type TeamDB = {
                tid: number;
                team_name: string;
                uid: number;
                created_at: string;
                updated_at: string;
            };

            const team = (
                await db<TeamDB[]>`select
        	*
        from
        	team
        where tid = ${tid}`
            )[0];
            const data: TeamData = {
                tid: team.tid,
                teamName: team.team_name,
                uid: team.uid,
                createdAt: team.created_at,
                updatedAt: team.updated_at,
            };

            return {
                status: 200,
                data: data,
            };
        } catch (e) {
            return handleServerError(e, "Team All By Id");
        }
    }

    async Create(data: NewTeam): PromiseReturn<{ msg: string; id: number }> {
        try {
            const res = (await db`insert into team (uid, team_name) values ${db(data, "id", "name")} returning tid`)[0];
            return {
                status: 200,
                data: {
                    msg: "Team created successfully",
                    id: res.tid,
                },
            };
        } catch (e) {
            return handleServerError(e, "Team Create");
        }
    }

    async Update(data: NewTeam): PromiseReturn<{ msg: string; id: number }> {
        try {
            const { id, name } = data;
            if (!(await this.doesTeamExist(id))) {
                throw new ServiceError("Team not found", 404);
            }

            const res = await db`update team set team_name = ${name} where tid = ${id}`;

            return {
                status: 200,
                data: {
                    msg: "Team updated successfully",
                    id,
                },
            };
        } catch (e) {
            return handleServerError(e, "Team Update");
        }
    }

    async Delete(id: number): PromiseReturn<MessageReturn> {
        try {
            if (!(await this.doesTeamExist(id))) {
                throw new ServiceError("Team not found", 404);
            }

            const res = await db`delete from team where tid = ${id}`;
            customLogger(`Delete team with id -> ${id}`);
            return {
                status: 200,
                data: {
                    msg: "Team deleted successfully",
                },
            };
        } catch (e) {
            return handleServerError(e, "TeamDelete");
        }
    }

    async DeleteManyTeamPokemon(teamPokemon: ManyNewTeamPokemon): PromiseReturn<{ msg: string }> {
        try {
            const { tid, pids } = teamPokemon;
            if (!(await this.doesTeamExist(tid))) {
                throw new ServiceError("Team does not exist", 404);
            }

            if (pids.length === 0) {
                throw new ServiceError("No pokemon to delete", 400);
            }

            for (const pid of pids) {
                if (!(await this.doesPokemonExistInTeam(tid, pid))) {
                    customLogger(`PID: ${pid}`);
                    throw new ServiceError("Some pokemon not found in team", 404);
                }
            }

            const res = await db`delete from team_pokemon where tid = ${tid} and pid in ${db(pids)}`;

            return {
                status: 200,
                data: {
                    msg: "Team pokemon deleted successfully",
                },
            };
        } catch (e) {
            return handleServerError(e, "Team Delete Many Pokemon");
        }
    }

    async DeleteTeamPokemon(teamPokemon: NewTeamPokemon): PromiseReturn<{ msg: string }> {
        try {
            const { tid, pid } = teamPokemon;

            if (!(await this.doesTeamExist(tid))) {
                throw new ServiceError("Team does not exist", 404);
            }

            if (!(await this.doesPokemonExistInTeam(tid, pid))) {
                throw new ServiceError("Pokemon not found in team", 404);
            }

            const res = await db`delete from team_pokemon where tid = ${tid} and pid = ${pid}`;

            await this.updateLastUpdated(tid);

            return {
                status: 200,
                data: {
                    msg: "Team pokemon deleted successfully",
                },
            };
        } catch (e) {
            return handleServerError(e, "Team Delete Pokemon");
        }
    }

    async TeamPokemonCount(tid: number): PromiseReturn<number> {
        try {
            if (!(await this.doesTeamExist(tid))) {
                throw new ServiceError("Team not found", 404);
            }

            const res = await db`select count(*) as count from team pokemon where tid = ${tid}`;
            return {
                status: 200,
                data: parseInt(res[0].count),
            };
        } catch (e) {
            return handleServerError(e, "TeamPokemonCount");
        }
    }

    async AddTeamPokemon(data: { tid: number; pokemon: NewPokemon[] }): PromiseReturn<MessageReturn> {
        try {
            const { tid, pokemon } = data;
            if (!(await this.doesTeamExist(tid))) {
                throw new ServiceError("Team not found", 404);
            }

            const countRes = await this.TeamPokemonCount(tid);
            if (!isOk(countRes.status)) {
                throw new ServiceError("Failed to fetch team pokemon count", 500);
            }
            const count = countRes.data!;
            if (count + pokemon.length > 6) {
                throw new ServiceError("Each team can have a maximum of 6 pokemon", 400);
            }

            customLogger(`Data: ${prettyPrint(data)}`);

            await db.begin(async (db) => {
                for (const p of pokemon) {
                    const { pid, nickname, level, is_shiny } = p;
                    if (await this.doesPokemonExistInTeam(tid, pid)) {
                        throw new ServiceError("Pokemon already exists in team", 400);
                    }
                    const res =
                        await db`insert into team_pokemon (tid, pid, nickname, level, is_shiny) values (${tid}, ${pid}, ${nickname}, ${level}, ${is_shiny})`;
                    customLogger("Inserting team pokemon");
                    if (await StatsService.doesStatsExist(pid, tid)) {
                        customLogger(`Stats already exist for pokemon ${pid} - ${tid}`);
                        continue;
                    } else {
                        const statsRes = await StatsService.FetchById(pid);
                        if (!isOk(statsRes.status)) {
                            throw new ServiceError("Failed to fetch stats", 500);
                        }

                        const data: PokemonStat = {
                            tid,
                            pid,
                            ...statsRes.data!,
                        };

                        const addRes = await StatsService.Add(data, db);
                        if (!isOk(addRes.status)) {
                            throw new ServiceError("Failed to add pokemon stats", 400);
                        }
                    }

                    if ((await MovesService.getMoveCount(pid, tid)) != 0) {
                        continue;
                    } else {
                        const moveRes = await MovesService.AssignRandomMoves(tid, pid, db);
                        if (!isOk(moveRes.status)) throw new ServiceError("Failed to assign starter moves", 500);
                    }

                    await this.updateLastUpdated(tid);
                }
            });

            return {
                status: 200,
                data: {
                    msg: "Team pokemon added successfully",
                },
            };
        } catch (e) {
            return handleServerError(e, "AddTeamPokemon");
        }
    }

    async TeamPokemon(
        tid: number,
    ): PromiseReturn<{ team: { team_id: number; team_name: string }; pokemon: TeamPokemon[] }> {
        try {
            if (!(await this.doesTeamExist(tid))) throw new ServiceError("Team not found", 404);

            const res = await db<TeamPokemonDB[]>`
select
	tm.pid,
	tm.tid,
	tm.is_shiny,
	tm."level",
	tm.nickname,
	pc.type1,
	pc.type2 ,
	pc.name,
	pc.sprite_url,
    pc.shiny_sprite_url,
	s.hp,
	s.attack,
	s.defense,
	s.spattack,
	s.spdefense,
	s.speed,
	m.mid
from
	team_pokemon tm
inner join pokemon_cache pc on
	pc.pid = tm.pid
inner join stats s on
	s.pid = tm.pid
left join moves m on
	m.pid = tm.pid
where
	tm.tid = ${tid}
`;
            const pokemonMap = new Map<number, TeamPokemon>();
            for (const poke of res) {
                const {
                    pid,
                    name,
                    nickname,
                    is_shiny,
                    sprite_url,
                    shiny_sprite_url,
                    level,
                    type1,
                    type2,
                    hp,
                    attack,
                    defense,
                    spattack,
                    spdefense,
                    speed,
                    mid,
                } = poke;
                const p = pokemonMap.get(pid);
                if (!p) {
                    pokemonMap.set(pid, {
                        tid,
                        pid,
                        name,
                        nickname,
                        is_shiny,
                        sprite_url,
                        shiny_sprite_url,
                        level,
                        type1,
                        type2,
                        stats: [
                            { name: "hp", value: hp },
                            { name: "attack", value: attack },
                            { name: "defense", value: defense },
                            { name: "spattack", value: spattack },
                            { name: "spdefense", value: spdefense },
                            { name: "speed", value: speed },
                        ],
                        moves: [{ mid }],
                    });
                } else {
                    p.moves.push({
                        mid,
                    });
                }
            }
            const pokemon = Array.from(pokemonMap.values());

            return {
                status: 200,
                data: {
                    team: {
                        team_id: tid,
                        team_name: (await this.ById(tid)).data!.teamName,
                    },
                    pokemon,
                },
            };
        } catch (e) {
            return handleServerError(e, "TeamPokemon");
        }
    }

    async UpdateTeamPokemon(data: UpdatePokemon): PromiseReturn<MessageReturn> {
        try {
            const { tid, pokemon } = data;
            const { pid, moves, stats } = pokemon;
            if (!(await this.doesTeamExist(tid))) {
                throw new ServiceError("Team not found", 404);
            }

            if (!(await this.doesPokemonExistInTeam(tid, pid))) {
                throw new ServiceError("Pokemon not found in team", 404);
            }

            await db.begin(async (db) => {
                const res =
                    await db`update team_pokemon set ${db(pokemon, "is_shiny", "level", "nickname")} where pid = ${pid} and tid = ${tid}`;

                const pokeStats = mapTeamPokemonToStatFetch(stats);
                const statsRes = await StatsService.UpdateByPokemon({
                    tid,
                    pid,
                    ...pokeStats,
                });

                if (!isOk(statsRes.status)) {
                    throw new ServiceError("Failed to update team pokemon stats", 500);
                }

                const movesRes = await MovesService.UpdateByPokemon({
                    pid,
                    tid,
                    moves,
                });

                if (!isOk(movesRes.status)) {
                    throw new ServiceError("Failed to update team pokemon moves", 500);
                }

                await this.updateLastUpdated(tid);
            });

            return {
                status: 200,
                data: {
                    msg: "Team pokemon update successfully",
                },
            };
        } catch (e) {
            return handleServerError(e, "Team Update Pokemon");
        }
    }
}

export default new TeamService();
