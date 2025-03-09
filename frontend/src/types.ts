import React from "react";

export type Unpack<T> = {
    [K in keyof T]: Unpack<T[K]>;
};

// From https://stackoverflow.com/a/52702528
export type Rename<T, K extends keyof T, N extends string> = Pick<T, Exclude<keyof T, K>> & { [P in N]: T[K] };

// From https://stackoverflow.com/a/54178819
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type MsgResponse = { msg: string };
export type StatusResponse = { status: string };
export type ErrorResponse<T = string> = { err: T };
export type ResponseWithError<T = string> = { response?: { data?: { data?: ErrorResponse<T> } } };

export type UID = number;
export type TID = number;

export type User = {
    uid: UID;
    fname: string;
    lname: string;
    uname: string;
    email: string;
    isAdmin: boolean;
};

export type NewUser = Omit<User, "uid"> & { password: string };

export type PasswordlessUser = Omit<User, "password">;

export type Team = {
    tid: TID;
    teamName: string;
    uid: UID;
    createdAt: string;
    updatedAt: string;
    user: PasswordlessUser;
};

export type NewTeam = {
    id: TID;
    name: string;
};

export type UserTeam = Omit<Team, "user">;

export type Move = {
    mid: number;
    name: string;
};

export type Pokemon = {
    tid: TID;
    pid: number;
    name: string;
    nickname: string;
    is_shiny: boolean;
    sprite_url: string;
    shiny_sprite_url: string;
    level: number;
    type1?: string;
    type2?: string;
};

export type NewPokemon = Pick<Pokemon, "pid" | "nickname" | "level" | "is_shiny">;

export type NewTeamPokemon = {
    tid: TID;
    pokemon: NewPokemon[];
};

export type TeamPokemonStat = { name: string; value: number };

export type TeamPokemonMove = { mid: number };

export type TeamPokemonIds = Pick<Pokemon, "tid"> & { pids: number[] };

export type UpdatePokemon = {
    tid: TID;
    pokemon: NewPokemon & {
        stats: TeamPokemonStat[];
        moves: TeamPokemonMove[];
    };
};

export type PokemonInfo = Pick<Pokemon, "pid" | "name" | "type1" | "type2" | "sprite_url" | "shiny_sprite_url"> & {
    last_updated?: number;
};

export type MoveFetch = {
    name: string;
    id: number;
    pp: number;
    type: {
        name: string;
        url: string;
    };
};

export type DisplayMove = {
    mid: number;
    name: string;
    type: string;
    pp: number;
};

export type Callback<Args extends unknown[] = []> = (...arg: Args) => void;
export type AsyncCallback<Args extends unknown[] = []> = (...arg: Args) => Promise<void>;

export type HeaderIitem = {
    label: string;
    href: string;
};

export type ClickHandler<T = Element> = React.MouseEventHandler<T>;
export type ChangeHandler<T = HTMLInputElement> = React.ChangeEventHandler<T>;

export type TeamPokemon = Pokemon & {
    stats: TeamPokemonStat[];
    moves: TeamPokemonMove[];
};

export type TeamInfo = {
    team: Rename<Rename<NewTeam, "id", "teamId">, "name", "teamName">;
    pokemon: TeamPokemon[];
};

export type ServiceResponseError = {
    response: {
        data: {
            err: string;
        };
    };
};

export type ResponseMaybeProblems = string | { err: ErrorResponse; problems: string[] };

export type Controls = {
    create?: boolean;
    view?: boolean;
    del?: boolean;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IFetch {
    get: (url: string) => Promise<any>;
    post: (url: string, data: any) => Promise<any>;
    put: (url: string, data: any) => Promise<any>;
    delete: (url: string) => Promise<any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
