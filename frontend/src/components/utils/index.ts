import { API_BASE } from "../constants";
import { fetch } from "./Fetch";

export const getDateString = (date: Date) => {
    return date.toISOString().split("T")[0];
};

export const getStringDate = (date: string) => {
    return new Date(date);
};

export const noneEmpty = <T>(arr: T[]) => {
    return arr.every((item) => item !== "");
};

export const formatPokemonName = (name: string) => {
    let formatted = name.indexOf("-") !== -1 ? name.split("-").join(" ") : name;
    formatted = formatted[0].toUpperCase() + formatted.slice(1);
    return formatted;
};

export const validate = (password: string, email: string) => {
    const emailRegex = /(\w+)@(\w+).(\w{2,})/;
    const passwordRegexes = [
        {
            msg: "Must be at least 8 characters long",
            regex: /.{8,}/,
        },
        {
            msg: "Must have at least one uppercase letter",
            regex: /[A-Z]/,
        },
        {
            msg: "Must include at least 3 digits",
            regex: /^(?=(.*\d.*){3,})/,
        },
        {
            msg: "Must contain at least one special character",
            regex: /[!@#$%^&*()\-_=+[\]{};:'",<.>/?\\|`~]/,
        },
    ];

    if (!emailRegex.test(email)) {
        throw Error("Invalid email address");
    }

    const problems: string[] = [];
    let result = true;

    passwordRegexes.map((item) => {
        const { msg, regex } = item;
        const matchRes = regex.test(password);
        if (!matchRes) problems.push(msg);
        if (result) {
            result = matchRes;
        }
    });

    if (!result) {
        throw Error(problems.join("\n"));
    }
};

export const ping = async () => {
    try {
        const res = await fetch.get(`${API_BASE}/user/ping`);

        if (res.status !== 200) {
            return false;
        }

        return true;
    } catch (e) {
        console.error({ e });
        return false;
    }
};

export const handlePing = async (callback: () => void) => {
    if (!(await ping())) {
        callback();
    }
};

export const getErrMsgIfExists = <T = string>(e: unknown): T | undefined => {
    try {
        const errorWithResponse = e as { response?: { data?: { err?: T } } };
        return errorWithResponse.response?.data?.err ?? undefined;
    } catch (error) {
        console.log({ error });
        return undefined;
    }
};

export function resolveError<E extends Error, R = void>(
    e: unknown,
    errorType: new (...args: never[]) => E,
    onResolved: (error: E) => R,
) {
    if (e instanceof errorType) {
        return onResolved(e as E);
    }
    console.error(`Resolve error failed: ${e}`);
}

/* Taken from https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b */
// Types for the result object with discriminated union
type Success<T> = {
    data: T;
    error: undefined;
};

type Failure<E> = {
    data: undefined;
    error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
        const data = await promise;
        return { data, error: undefined };
    } catch (error) {
        return { data: undefined, error: error as E };
    }
}
