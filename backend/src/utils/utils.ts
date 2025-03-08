import type { ContentfulStatusCode, StatusCode } from "hono/utils/http-status";
import type { PromiseReturn, ServiceReturn, StatFetch, TeamPokemonStat } from "../types/index.js";
import type { Context } from "hono";
import { customLogger } from "../logging.js";

export const isOk = (status: ContentfulStatusCode | number) => status <= 399 && status >= 100;

export const sendData = <T>(data: T) => ({ data: data });

export const sendMsg = (msg: string) => sendData({ msg });

export const sendError = <T>(err: T) => ({ data: { err: err } });

export const sendSR = async <T>(
    c: Context,
    res: ServiceReturn<T>,
    onSuccess: Function = () => {},
    onError: Function = () => {},
) => {
    if (isOk(res.status)) await onSuccess();
    else await onError();

    return c.json(sendData(res.data), res.status);
};

export const prettyPrint = <T>(log: T) => {
    return JSON.stringify(
        log,
        (key, value) => {
            if (value instanceof Map) {
                return `Map<${typeof value.values()}, ${typeof value.keys()}>`;
            }
            return value;
        },
        4,
    );
};

export const serviceWrapper = async <T>(fn: () => PromiseReturn<T>, message: string) => {
    try {
        const res = await fn();
        return res;
    } catch (e) {}
};

export class ServiceError extends Error {
    status: ContentfulStatusCode;

    constructor(message: string, status: ContentfulStatusCode) {
        super(message);
        this.name = "ServiceError";
        this.status = status;
    }
}

export const resolveError = (error: unknown) => {
    if (error instanceof ServiceError) {
        return error;
    } else if (error instanceof Error && error.message != undefined) {
        return new ServiceError(error.message, 500);
    }

    if (error) console.error(`Unknown error -> ${error}`);

    return new ServiceError("Something went wrong", 500);
};
export const handleServerError = (error: unknown, message: string): ServiceReturn => {
    const err = resolveError(error);
    if (err.status == 500) {
        customLogger(`${message} error -> ${err.stack}`);
    } else customLogger(`${message} error -> ${err.message}`);
    return { status: err.status, data: { err: err.message } };
};

export const rng = (max: number, min: number = 0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const formatPokemonName = (name: string) => {
    let formatted = name.replaceAll("-", " ");
    formatted = formatted[0].toUpperCase() + formatted.slice(1);
    return formatted;
};

export const shuffle = <T>(array: T[]) => {
    const n = array.length;
    for (let i = n - 1; i >= 0; i--) {
        const j = rng(i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
};

export const mapTeamPokemonToStatFetch = (data: TeamPokemonStat[]): StatFetch =>
    Object.assign(
        {},
        ...data.map((stat) => {
            return { [stat.name]: stat.value };
        }),
    );

export function debounce<T extends (...args: any[]) => any>(func: T, waitFor: number = 2500) {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>): Promise<ReturnType<T>> =>
        new Promise((resolve) => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => resolve(func(...args)), waitFor);
        });
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
