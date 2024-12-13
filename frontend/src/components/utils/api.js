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
    GET_BY_ID,
    SEARCH,
    UPDATE_TEAM,
    UPDATE_TEAM_POKEMON,
} from "../constants/index.js";
import { fetch } from "./Fetch.js";
import { getErrMsgIfExists } from "./index.js";

export const getTeams = async (uid) => {
    try {
        const res = await fetch.get(`${API_BASE}${ALL_TEAMS}${uid}`);
        console.log({ res });
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
        console.log({ res });
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
        console.log({ res });
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
        console.log({ res });
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
        console.log({ res });
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
        console.log({ res });
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
        console.log({ res });
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
        console.log({ res });
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
        console.log({ res });
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
        console.log({ res });
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
        console.log({ res });
        const data = res.data;
        return data;
    } catch (error) {
        console.error({ error });
        const msg = getErrMsgIfExists(error) || "An error occured";
        throw new Error(msg);
    }
};
