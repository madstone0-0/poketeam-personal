import { useContext } from "react";
import { PokeContext } from "../PoketeamProvider";

export const usePoke = () => useContext(PokeContext);
