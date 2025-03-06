import React, { useState, useEffect, useMemo } from "react";
import withLoading from "../WithLoading";
import { getMoveInfo } from "../utils/api";
import TypeBadge from "../TypeBadge";
import "./index.css";
import { DisplayMove, Move, TeamPokemonMove } from "../../types";

type MovesDisplayProps = {
    moves: TeamPokemonMove[];
    editMode?: boolean;
    onClick?: (move: DisplayMove | Move) => void;
};

const MovesDisplay = ({ moves, editMode = false, onClick = () => {} }: MovesDisplayProps) => {
    const [displayMoves, setDisplayMoves] = useState<DisplayMove[]>([]);
    const [loading, setLoading] = useState(true);

    const memoizedMoves = useMemo(() => moves, [moves]);

    useEffect(() => {
        const fetchMoves = async () => {
            try {
                const movePromises = memoizedMoves.map(async (move) => {
                    try {
                        const moveInfo = await getMoveInfo(move.mid);
                        return {
                            mid: move.mid,
                            name: moveInfo.name,
                            type: moveInfo.type.name,
                            pp: moveInfo.pp,
                        };
                    } catch (e) {
                        console.error(`Error fetching move ${move.mid}:`, e);
                        return null;
                    }
                });

                const fetchedMoves = await Promise.all(movePromises);

                const uniqueMoves = Array.from(
                    new Map(
                        fetchedMoves
                            .filter((move): move is DisplayMove => move !== null)
                            .map((move) => [move.mid, move]),
                    ).values(),
                );

                const sortedMoves = uniqueMoves.sort((a, b) => a.mid - b.mid);

                setDisplayMoves(sortedMoves);
            } catch (error) {
                console.error("Error in move fetching:", error);
            } finally {
                setLoading(false);
            }
        };

        if (memoizedMoves.length > 0) {
            fetchMoves();
        } else {
            setLoading(false);
        }
    }, [memoizedMoves]);

    return withLoading(MovesDiv)({ moves: displayMoves, loading, editMode, onClick });
};

type MovesDivProps = {
    moves: DisplayMove[];
    editMode: boolean;
    onClick: (move: DisplayMove) => void;
};

const MovesDiv = ({ moves, editMode, onClick }: MovesDivProps) => {
    const formatMoveName = (name: string) => {
        return name
            .split("-")
            .join(" ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="flex flex-row flex-wrap justify-center self-center w-full h-fit">
            {moves.map((move) => (
                <div
                    key={move.mid}
                    onClick={(e) => onClick(move)}
                    className={`m-4 w-52 md:w-96 shadow-xl card bg-base-100 ${editMode ? "moves-card" : ""}`}
                >
                    <div className="card-body">
                        <h2 className="card-title">
                            {formatMoveName(move.name)} <span className="text-sm text-gray-500">#{move.mid}</span>
                        </h2>
                        <TypeBadge type={move.type} />
                        <div className="flex flex-row justify-between w-full">
                            <p>
                                <span className="font-bold">PP:</span> {move.pp}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MovesDisplay;
