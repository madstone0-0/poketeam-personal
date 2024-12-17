import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getPokemonMovesById, searchPokemon } from "../utils/api";
import Input from "../Input";
import PokemonGrid from "../PokemonGrid";
import { useSnackbar } from "notistack";
import tempStore from "../stores/tempStore";
import MovesDisplay from "../MovesDisplay";
import { useVirtualizer } from "@tanstack/react-virtual";
import "../MovesDisplay/index.css";

const MovesPicker = ({ pid, moves, pickMove }) => {
    const [searchMoves, setMoves] = useState([]);
    const [shownMoves, setShownMoves] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [pickerOpen, setPickerOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const MAX_MOVES = 4;

    useEffect(() => {
        (async () => {
            const movesRes = await getPokemonMovesById(pid);

            setMoves(movesRes);
            setShownMoves(movesRes);
        })();
    }, []);

    useEffect(() => {
        if (searchTerm.length == 0) {
            setShownMoves(searchMoves);
            return;
        }

        setShownMoves(
            searchMoves.filter((move) => {
                const normedMove = move.name.split("-").join(" ").toLowerCase();
                const normedSearch = searchTerm.toLowerCase();
                return normedMove.includes(normedSearch);
            }),
        );
    }, [searchTerm]);

    const onMoveSelect = (move) => {
        const found = moves.find((m) => m.mid === move.id);

        if (found) {
            pickMove(moves.filter((m) => m.mid !== move.id));
        } else {
            if (moves.length >= MAX_MOVES) {
                enqueueSnackbar("Too many moves", { variant: "error" });
                return;
            }
            pickMove([...moves, { mid: move.id }]);
        }
    };

    const handleChange = useCallback(
        (e) => {
            setSearchTerm(e.target.value);
        },
        [setSearchTerm],
    );

    const formatMoveName = (name) => {
        return name
            .split("-")
            .join(" ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    const parentRef = React.useRef(null);

    const rowVirtualizer = useVirtualizer({
        count: 4,
        parentRef,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
    });

    const elements = useMemo(() => {
        if (searchMoves.length == 0) {
            return <></>;
        }
        return shownMoves.map((move) => {
            const foundInMoves = moves.find((m) => m.mid === move.id);
            const border = foundInMoves ? "border-4 border-primary" : "border-4 border-transparent";
            return (
                <div
                    onClick={(e) => onMoveSelect(move)}
                    className={`m-4 shadow-xl h-fit moves-card w-50 card bg-base-100 ${border}`}
                >
                    <div className="card-body">
                        <h2 className="card-title">
                            {formatMoveName(move.name)} <span className="text-sm text-gray500">#({move.id})</span>
                        </h2>
                    </div>
                </div>
            );
        });
    });

    return (
        <>
            <div
                onClick={(e) => e.stopPropagation()}
                className="self-center p-1 md:p-3 mt-5 w-full  md:w-[95%] rounded-lg collapse bg-base-100"
            >
                <input checked={pickerOpen} onChange={(e) => setPickerOpen(!pickerOpen)} type="checkbox" />
                <h1 className="mb-5 text-3xl text-center collapse-title">Move Picker</h1>
                <div className="collapse-content">
                    <div className="flex justify-center mb-5">
                        <Input
                            type="text"
                            id="search"
                            name="search"
                            placeholder="Search Moves"
                            value={searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        {searchMoves.length > 0 ? (
                            <div ref={parentRef} style={{ overflow: "auto" }}>
                                <div
                                    style={{
                                        height: `${rowVirtualizer.getTotalSize()}px`,
                                        width: "100%",
                                        position: "relative",
                                    }}
                                    className="flex flex-row flex-wrap justify-center self-center w-full min-h-96"
                                >
                                    {elements}
                                </div>
                            </div>
                        ) : (
                            <h2 className="text-xl text-center">No Moves Found</h2>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MovesPicker;
