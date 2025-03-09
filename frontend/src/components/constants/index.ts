export const POKEAPI_BASE = "https://pokeapi.co/api/v2/";
const API_BASE = import.meta.env.VITE_API_BASE;

export const DEFAULT_LEVEL = 10;

export const LOGIN = "/auth/login";
export const SIGNUP = "/auth/signup";
export const LOGOUT = "/auth/logout";
export const DELETE_USER = "/auth/delete/";
export const UPDATE_USER = "/auth/update";

export const USER_ROUTE = "/user/";
export const ADMIN_ROUTE = "/admin/";

export const POKEMON_ROUTE = `${USER_ROUTE}pokemon/`;
export const SEARCH = `${POKEMON_ROUTE}search`;
export const GET_BY_ID = `${POKEMON_ROUTE}id/`;
export const GET_MOVES_BY_ID = `${POKEMON_ROUTE}moves/`;
export const GET_MOVE_INFO_BY_ID = `${POKEMON_ROUTE}move-info/`;

export const TEAM_ROUTE = `${USER_ROUTE}team/`;
export const ALL_TEAMS = `${TEAM_ROUTE}all/`;
export const ALL_TEAM_POKEMON = `${TEAM_ROUTE}pokemon-id/`;
export const CREATE_TEAM = `${TEAM_ROUTE}create`;
export const DELETE_TEAM = `${TEAM_ROUTE}delete/`;
export const UPDATE_TEAM = `${TEAM_ROUTE}update`;
export const ADD_TEAM_POKEMON = `${TEAM_ROUTE}pokemon-add`;
export const DELETE_TEAM_POKEMON = `${TEAM_ROUTE}pokemon-delete/`;
export const DELETE_MANY_TEAM_POKEMON = `${TEAM_ROUTE}pokemon-delete-many`;
export const UPDATE_TEAM_POKEMON = `${TEAM_ROUTE}pokemon-update`;

export const MOVE_ROUTE = "/move";

export const GET_ALL_USERS = `${ADMIN_ROUTE}users/all`;
export const GET_ALL_TEAMS = `${ADMIN_ROUTE}teams/all`;
export const GET_ALL_POKEMON = `${ADMIN_ROUTE}teams/all-pokemon`;

export { API_BASE };
