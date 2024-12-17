import PokemonGrid from "../PokemonGrid/index.jsx";
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
    POKEAPI_BASE,
    SEARCH,
    UPDATE_TEAM,
    UPDATE_TEAM_POKEMON,
    UPDATE_USER,
} from "../constants/index.js";
import { fetch } from "./Fetch.js";
import axios from "axios";
import { getErrMsgIfExists } from "./index.js";

export const getAllPokemon = async () => {
    try {
        const res = await fetch.get(`${API_BASE}${GET_ALL_POKEMON}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const updateUser = async (data) => {
    try {
        const res = await fetch.put(`${API_BASE}${UPDATE_USER}`, data);
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
        const res = await fetch.get(`${API_BASE}${GET_ALL_TEAMS}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const deleteUser = async (uid) => {
    try {
        const res = await fetch.delete(`${API_BASE}${DELETE_USER}${uid}`);
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
        const res = await fetch.get(`${API_BASE}${GET_ALL_USERS}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getMoveInfo = async (mid, abort) => {
    try {
        const res = await axios.get(`${POKEAPI_BASE}move/${mid}`, {
            baseURL: "",
            withCredentials: false,
            abortSignal: abort,
        });
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getTeams = async (uid) => {
    try {
        const res = await fetch.get(`${API_BASE}${ALL_TEAMS}${uid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getPokemonMovesById = async (pid) => {
    try {
        const res = await fetch.get(`${API_BASE}${GET_MOVES_BY_ID}${pid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getTeamInfoById = async (tid) => {
    try {
        const res = await fetch.get(`${API_BASE}${ALL_TEAM_POKEMON}${tid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const createTeam = async (data) => {
    try {
        const res = await fetch.post(`${API_BASE}${CREATE_TEAM}`, data);
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const deleteTeamById = async (tid) => {
    try {
        const res = await fetch.delete(`${API_BASE}${DELETE_TEAM}${tid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const updateTeamById = async (data) => {
    try {
        const res = await fetch.put(`${API_BASE}${UPDATE_TEAM}`, data);
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const getPokemonById = async (pid) => {
    try {
        const res = await fetch.get(`${API_BASE}${GET_BY_ID}${pid}`);
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const addTeamPokemon = async (data) => {
    try {
        const res = await fetch.post(`${API_BASE}${ADD_TEAM_POKEMON}`, data);
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const deleteTeamPokemon = async (tid, pid) => {
    try {
        const res = await fetch.delete(`${API_BASE}${DELETE_TEAM_POKEMON}`, { data: JSON.stringify({ tid, pid }) });
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const deleteManyTeamPokemon = async (data) => {
    try {
        const { tid, pids } = data;
        const res = await fetch.delete(`${API_BASE}${DELETE_MANY_TEAM_POKEMON}`, {
            data: JSON.stringify({ tid, pids }),
        });
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const updateTeamPokemon = async (data) => {
    try {
        const res = await fetch.put(`${API_BASE}${UPDATE_TEAM_POKEMON}`, data);
        const d = res.data;
        return d;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};

export const searchPokemon = async (name) => {
    try {
        const res = await fetch.post(`${API_BASE}${SEARCH}`, { name: name });
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};
