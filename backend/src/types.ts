import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface ServiceReturn<Data = any> {
    status: ContentfulStatusCode;
    message?: string;
    data?: Data;
    extra?: any;
}

export type PromiseReturn<Data = any> = Promise<ServiceReturn<Data>>;

export type UserDB = {
    uid: number;
    fname: string;
    lname: string;
    email: string;
    username: string;
    passhash: string;
    is_admin: boolean;
};

export type UserData = {
    uid: number;
    fname: string;
    lname: string;
    email: string;
    uname: string;
    passhash: string;
    isAdmin: boolean;
};

// From https://stackoverflow.com/a/52702528
export type Rename<T, K extends keyof T, N extends string> = Pick<T, Exclude<keyof T, K>> & { [P in N]: T[K] };

export type NewUser = Omit<UserData, "uid">;

export type User = {
    email: string;
    password: string;
};

export interface AllTeamData {
    tid: number;
    teamName: string;
    uid: number;
    createdAt: string;
    updatedAt: string;
    user: Rename<Omit<UserData, "passhash" | "isAdmin" | "uid">, "uname", "username">;
}

export type TeamData = Omit<AllTeamData, "user">;

export type NewTeam = {
    id: number;
    name: string;
};

export type NewTeamPokemon = {
    tid: number;
    pid: number;
};

export type ManyNewTeamPokemon = Omit<NewTeamPokemon, "pid"> & { pids: number[] };

export type CacheTimestampFile = {
    timestamp?: number;
    success?: boolean;
};

export interface PokemonCacheDB {
    pid: number;
    name: string;
    type1?: string;
    type2?: string;
    sprite_url?: string;
    shiny_sprite_url?: string;
    last_updated?: number;
}

export type MoveFetchRes = {
    move: {
        name: string;
        url: string;
    };
};

export type StatFetchRes = {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
};

export type PokemonFetchRes = PokemonCacheDB & {
    stats: StatFetchRes[];
    moves: MoveFetchRes[];
};

export type NewPokemon = {
    pid: number;
    nickname: string;
    is_shiny: boolean;
    level: number;
};

export type Pokemon = PokemonCacheDB & NewPokemon;

export type MoveFetch = {
    mid: number;
    name: string;
};

export type PokemonMove = {
    mid: number;
    pid: number;
    tid: number;
};

export type StatFetch = {
    hp: number;
    attack: number;
    defense: number;
    spattack: number;
    spdefense: number;
    speed: number;
};

export type PokemonStat = StatFetch & {
    tid: number;
    pid: number;
};

export type StatDB = StatFetchRes & {
    sid: number;
    pid: number;
    tid: number;
};

export type TeamPokemonDB = NewTeamPokemon &
    NewPokemon &
    PokemonCacheDB &
    PokemonStat & {
        mid: number;
    };

export type TeamPokemonStat = { name: string; value: number };

export type TeamPokemonMove = { mid: number };

export type TeamPokemon = NewTeamPokemon &
    NewPokemon &
    PokemonCacheDB & {
        stats: TeamPokemonStat[];
        moves: TeamPokemonMove[];
    };

export type UpdatePokemon = Omit<NewTeamPokemon, "pid"> & {
    pokemon: NewPokemon & {
        stats: TeamPokemonStat[];
        moves: TeamPokemonMove[];
    };
};

export type MessageReturn = { msg: string };
