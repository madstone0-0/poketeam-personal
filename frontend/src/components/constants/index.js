export const POKEAPI_BASE = "https://pokeapi.co/api/v2";
let API_BASE = "";

if (import.meta.env.PROD) {
    API_BASE = "http://169.239.251.102:3341/~madiba.quansah/poketeam/backend/src/index.php";
} else if (import.meta.env.DEV) {
    API_BASE = "http://localhost:8000";
}

export const LOGIN = "/auth/login";
export const SIGNUP = "/auth/signup";
export const LOGOUT = "/auth/logout";
export const DELETE_USER = "/auth/delete";

export const POKEMON_ROUTE = "/pokemon";
export const MOVE_ROUTE = "/move";

export { API_BASE };
