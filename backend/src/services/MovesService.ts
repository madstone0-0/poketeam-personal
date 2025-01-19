import { custom } from "zod";
import db from "../db/db.js";
import type { MessageReturn, MoveFetch, MoveFetchRes, PokemonMove, PromiseReturn, TeamPokemonMove } from "../types.js";
import { handleServerError, isOk, prettyPrint, ServiceError, shuffle } from "../utils.js";
import PokemonService from "./PokemonService.js";
import { customLogger } from "../logging.js";
import type { TransactionSql } from "postgres";

class MovesService {
    private async doesMovesExist(pid: number, tid: number) {
        const res = await db`select tid from moves where tid = ${tid} and pid = ${pid}`;
        return res.length > 0;
    }

    async getMoveCount(pid: number, tid: number): Promise<number> {
        const res = await db`select count(*) from moves where pid = ${pid} and tid = ${tid}`;
        const count = parseInt(res[0].count);
        return count;
    }

    async FetchByPid(pid: number): PromiseReturn<MoveFetch[]> {
        const res = await PokemonService.FromAPIById(pid);
        if (!isOk(res.status)) {
            throw new ServiceError("Failed to fetch pokemon data", 500);
        }

        const moves = res.data!.moves;
        const pokeMoves = moves.map((move) => {
            const mid = move.move.url.split("/")[6];
            return {
                mid: parseInt(mid),
                name: move.move.name,
            };
        });
        return {
            status: 200,
            data: pokeMoves,
        };
    }

    async Add(move: PokemonMove, transaction?: TransactionSql): PromiseReturn<{ msg: string }> {
        try {
            const { tid, pid } = move;
            const moveCount = await this.getMoveCount(pid, tid);
            customLogger(`Move: ${prettyPrint(move)}`);

            if (moveCount >= 4) {
                throw new ServiceError("Toom many moves", 400);
            }

            if (transaction) {
                const res =
                    await transaction`insert into moves (pid, tid, mid) values ${transaction(move, "pid", "tid", "mid")}`;
            } else {
                const res = await db`insert into moves (pid, tid, mid) values ${db(move, "pid", "tid", "mid")}`;
            }

            return {
                status: 200,
                data: {
                    msg: "Move added successfully",
                },
            };
        } catch (e) {
            return handleServerError(e, "MoveAdd");
        }
    }

    private async selectUniqueRandomMoves(moves: MoveFetch[], count: number) {
        shuffle(moves);

        const uniqueMoveIds = new Set();
        const selectedMoves = [];

        for (const move of moves) {
            if (!uniqueMoveIds.has(move.mid)) {
                uniqueMoveIds.add(move.mid);
                selectedMoves.push(move);
            }
            if (selectedMoves.length >= count) break;
        }

        return selectedMoves;
    }

    async AssignRandomMoves(
        tid: number,
        pid: number,
        transaction?: TransactionSql,
    ): PromiseReturn<{ msg: string; moves: number[] }> {
        try {
            const movesRes = await this.FetchByPid(pid);
            if (!isOk(movesRes.status)) {
                throw new ServiceError("Failed to fetch Moves", 500);
            }

            const moves = movesRes.data!;
            const selectedMoves = await this.selectUniqueRandomMoves(moves, 4);
            customLogger(`Moves: ${prettyPrint(selectedMoves)}`);
            const assignedMoves = [];

            for (const move of selectedMoves) {
                const addRes = await this.Add(
                    {
                        tid,
                        pid,
                        mid: move.mid,
                    },
                    transaction,
                );

                if (!isOk(addRes.status)) {
                    throw new ServiceError(`Failed to assing move: ${move.mid}`, 500);
                }

                assignedMoves.push(move.mid);
            }

            return {
                status: 200,
                data: {
                    msg: "Starter moves assigned successfully",
                    moves: assignedMoves,
                },
            };
        } catch (e) {
            return handleServerError(e, "AssignRandomMoves");
        }
    }

    async DeleteAllMovesByPokemon(tid: number, pid: number): PromiseReturn<MessageReturn> {
        try {
            const res = await db`delete from moves where pid = ${pid} and tid = ${tid}`;

            return {
                status: 200,
                data: {
                    msg: "Moves deleted successfully",
                },
            };
        } catch (e) {
            return handleServerError(e, "MovesDeleteAllMovesByPokemon");
        }
    }

    async UpdateByPokemon(
        data: { pid: number; tid: number; moves: TeamPokemonMove[] },
        transaction?: TransactionSql,
    ): PromiseReturn<MessageReturn> {
        try {
            const { pid, tid, moves } = data;
            const deleteRes = await this.DeleteAllMovesByPokemon(tid, pid);

            if (!isOk(deleteRes.status)) {
                throw new ServiceError("Failed to delete moves", 500);
            }

            for (const move of moves) {
                if (transaction) {
                    const res =
                        await transaction`insert into moves (pid, tid, mid) values (${pid}, ${tid}, ${move.mid})`;
                } else {
                    const res = await db`insert into moves (pid, tid, mid) values (${pid}, ${tid}, ${move.mid})`;
                }
            }

            return {
                status: 200,
                data: {
                    msg: "Moves updated successfully",
                },
            };
        } catch (e) {
            return handleServerError(e, "MovesUpdateByPokemon");
        }
    }
}

export default new MovesService();
