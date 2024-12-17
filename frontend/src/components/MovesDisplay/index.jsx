import React, { useState, useEffect } from "react";
import withLoading from "../WithLoading";
import { getMoveInfo } from "../utils/api";
import TypeBadge from "../TypeBadge";
import "./index.css";

const MovesDisplay = ({ moves, editMode = false, onClick = () => {} }) => {
    const [displayMoves, setDisplayMoves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const abortController = new AbortController();
            let tempMoves = new Set();
            for (const move of moves) {
                try {
                    const moveInfo = await getMoveInfo(move.mid);
                    tempMoves.add({
                        mid: move.mid,
                        name: moveInfo.name,
                        type: moveInfo.type.name,
                        pp: moveInfo.pp,
                    });
                } catch (e) {
                    loading && setLoading(false);
                    console.error({ e });
                }
            }
            loading && setLoading(false);
            tempMoves = [...tempMoves];
            setDisplayMoves([...tempMoves.sort((a, b) => parseInt(a.mid) - parseInt(b.mid))]);
        })();
    }, []);

    return withLoading(MovesDiv)({ moves: displayMoves, loading, editMode, onClick });
};

const MovesDiv = ({ moves, editMode, onClick }) => {
    const formatMoveName = (name) => {
        return name
            .split("-")
            .join(" ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <div className="flex flex-row flex-wrap justify-center self-center w-full h-fit">
            {moves.map((move, key) => (
                <div
                    key={key}
                    onClick={(e) => onClick(move)}
                    className={`m-4 w-96 shadow-xl card bg-base-100 ${editMode ? "moves-card" : ""}`}
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
