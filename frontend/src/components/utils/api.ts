import {
    ADD_TEAM_POKEMON,
    ALL_TEAMS,
    ALL_TEAM_POKEMON,
    API_BASE,
    CREATE_TEAM,
    DELETE_MANY_TEAM_POKEMON,
    DELETE_TEAM,
    DELETE_TEAM_POKEMON,
    DELETE_USER,
    GET_ALL_POKEMON,
    GET_ALL_TEAMS,
    GET_ALL_USERS,
    GET_BY_ID,
    GET_MOVES_BY_ID,
    GET_MOVE_INFO_BY_ID,
    POKEAPI_BASE,
    SEARCH,
    UPDATE_TEAM,
    UPDATE_TEAM_POKEMON,
    UPDATE_USER,
} from "../constants/index.js";
import { fetch } from "./Fetch.ts";
import axios from "axios";
import { getErrMsgIfExists } from "./index.js";
import {
    Move,
    MoveFetch,
    MsgResponse,
    NewTeam,
    NewTeamPokemon,
    Pokemon,
    PokemonInfo,
    Team,
    TeamInfo,
    TeamPokemonIds,
    TID,
    UID,
    UpdatePokemon,
    User,
    UserTeam,
} from "../../types.ts";

export const getAllPokemon = async () => {
    try {
        const res = await fetch.get<Pokemon[]>(`${API_BASE}${GET_ALL_POKEMON}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const updateUser = async (data: User) => {
    try {
        const res = await fetch.put<MsgResponse>(`${API_BASE}${UPDATE_USER}`, data);
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getAllTeams = async () => {
    try {
        const res = await fetch.get<Team[]>(`${API_BASE}${GET_ALL_TEAMS}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const deleteUser = async (uid: UID) => {
    try {
        const res = await fetch.delete<MsgResponse>(`${API_BASE}${DELETE_USER}${uid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getAllUsers = async () => {
    try {
        const res = await fetch.get<User[]>(`${API_BASE}${GET_ALL_USERS}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getMoveInfo = async (mid: number, abort?: AbortSignal) => {
    try {
        const res = await fetch.get<MoveFetch>(`${API_BASE}${GET_MOVE_INFO_BY_ID}${mid}`, {
            signal: abort,
        });
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getTeams = async (uid: UID) => {
    try {
        const res = await fetch.get<UserTeam[]>(`${API_BASE}${ALL_TEAMS}${uid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getPokemonMovesById = async (pid: number) => {
    try {
        const res = await fetch.get<Move[]>(`${API_BASE}${GET_MOVES_BY_ID}${pid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getTeamInfoById = async (tid: TID) => {
    try {
        const res = await fetch.get<TeamInfo>(`${API_BASE}${ALL_TEAM_POKEMON}${tid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const createTeam = async (data: NewTeam) => {
    try {
        const res = await fetch.post<MsgResponse>(`${API_BASE}${CREATE_TEAM}`, data);
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const deleteTeamById = async (tid: TID) => {
    try {
        const res = await fetch.delete<MsgResponse>(`${API_BASE}${DELETE_TEAM}${tid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const updateTeamById = async (data: NewTeam) => {
    try {
        const res = await fetch.put<MsgResponse & { id: number }>(`${API_BASE}${UPDATE_TEAM}`, data);
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getPokemonById = async (pid: number) => {
    try {
        const res = await fetch.get<Pokemon>(`${API_BASE}${GET_BY_ID}${pid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const addTeamPokemon = async (data: NewTeamPokemon) => {
    try {
        const res = await fetch.post<MsgResponse>(`${API_BASE}${ADD_TEAM_POKEMON}`, data);
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const deleteTeamPokemon = async (data: { tid: TID; pid: number }) => {
    const { tid, pid } = data;
    try {
        const res = await fetch.delete(`${API_BASE}${DELETE_TEAM_POKEMON}`, { data: JSON.stringify({ tid, pid }) });
        const data = res.data as unknown as MsgResponse;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const deleteManyTeamPokemon = async (data: TeamPokemonIds) => {
    try {
        const { tid, pids } = data;
        const res = await fetch.delete(`${API_BASE}${DELETE_MANY_TEAM_POKEMON}`, {
            data: JSON.stringify({ tid, pids }),
        });
        const d = res.data as unknown as MsgResponse;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const updateTeamPokemon = async (data: UpdatePokemon) => {
    try {
        const res = await fetch.put<MsgResponse>(`${API_BASE}${UPDATE_TEAM_POKEMON}`, data);
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const searchPokemon = async (name: string) => {
    try {
        const res = await fetch.post<PokemonInfo[]>(`${API_BASE}${SEARCH}`, { name: name });
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};
