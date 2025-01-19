import { join } from "path";
const POKE_API = "https://pokeapi.co/api/v2";
const HASH_ROUNDS = 10;

const CACHE_FILE = join(import.meta.dirname, "cache_timestamp.json");
const CACHE_TIMESTAMP_KEY = "timestamp";
const CACHE_SUCCESS_KEY = "success";
const AGE_TO_UPDATE = 24 * 60 * 60 * 1000;

const HEALTH_TEXT = `They have taken the bridge and the second hall.
We have barred the gates but cannot hold them for long.
The ground shakes, drums... drums in the deep. We cannot get out.
A shadow lurks in the dark. We can not get out.
They are coming.
`;

export { POKE_API, AGE_TO_UPDATE, HEALTH_TEXT, HASH_ROUNDS, CACHE_SUCCESS_KEY, CACHE_TIMESTAMP_KEY, CACHE_FILE };
