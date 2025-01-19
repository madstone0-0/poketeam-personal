import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const baseUser = z.object({
    uid: z.number({ coerce: true }),
    fname: z.string(),
    lname: z.string(),
    email: z.string().email(),
    password: z.string(),
    username: z.string(),
    isAdmin: z.boolean({
        coerce: true,
    }),
});

const pokemonBase = z.object({
    tid: z.number({
        coerce: true,
    }),
    pid: z.number({
        coerce: true,
    }),
    nickname: z.string(),
    level: z.number({
        coerce: true,
    }),
    is_shiny: z.boolean({
        coerce: true,
    }),
});

const movesBase = z.object({
    mid: z.number(),
});

const statsBase = z.object({
    name: z.string(),
    value: z.number(),
});

export const signUpValidator = zValidator("json", baseUser.omit({ uid: true }));

export const loginValidator = zValidator("json", baseUser.pick({ email: true, password: true }));

export const userUpdateValidator = zValidator(
    "json",
    baseUser.omit({ password: true, isAdmin: true }).extend({
        is_admin: z.boolean({
            coerce: true,
        }),
    }),
);

export const createTeamValidator = zValidator(
    "json",
    z.object({
        id: z.number().gte(0),
        name: z.string(),
    }),
);

export const idValidator = zValidator(
    "json",
    z.object({
        id: z.number().gte(0),
    }),
);

export const teamPokemonValidator = zValidator("json", pokemonBase);

export const pokemonSearchValidator = zValidator(
    "json",
    z.object({
        name: z.string(),
    }),
);

export const teamPokemonAddValidator = zValidator(
    "json",
    z.object({
        tid: z.number({
            coerce: true,
        }),
        pokemon: z.array(pokemonBase.omit({ tid: true })),
    }),
);

export const teamPokemonUpdateValidator = zValidator(
    "json",
    z.object({
        tid: z.number({ coerce: true }),
        pokemon: pokemonBase.omit({ tid: true }).extend({
            moves: z.array(movesBase),
            stats: z.array(statsBase),
        }),
    }),
);

export const teamPokemonDeleteManyValidator = zValidator(
    "json",
    pokemonBase.pick({ tid: true }).extend({
        pids: z.array(z.number()),
    }),
);
