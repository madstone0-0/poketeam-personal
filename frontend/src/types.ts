export type Unpack<T> = {
    [K in keyof T]: Unpack<T[K]>;
};

export type Pokemon = {
    tid: number;
    pid: number;
    name: string;
    nickname: string;
    is_shiny: boolean;
    sprite_url: string;
    shiny_sprite_url: string;
    level: number;
    type1: string;
    type2?: string;
};
