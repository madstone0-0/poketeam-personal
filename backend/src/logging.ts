import { prettyPrint } from "./utils/utils.js";

/* Taken from https://github.com/honojs/hono/blob/main/src/middleware/logger/index.ts */
import type { MiddlewareHandler } from "hono/types";
import { getColorEnabled } from "hono/utils/color";
import { getPath } from "hono/utils/url";

enum LogPrefix {
    Outgoing = "-->",
    Incoming = "<--",
    Error = "xxx",
}

const humanize = (times: string[]) => {
    const [delimiter, separator] = [",", "."];

    const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));

    return orderTimes.join(separator);
};

const time = (start: number) => {
    const delta = Date.now() - start;
    return humanize([delta < 1000 ? delta + "ms" : Math.round(delta / 1000) + "s"]);
};

const colorStatus = (status: number) => {
    const colorEnabled = getColorEnabled();
    if (colorEnabled) {
        switch ((status / 100) | 0) {
            case 5: // red = error
                return `\x1b[31m${status}\x1b[0m`;
            case 4: // yellow = warning
                return `\x1b[33m${status}\x1b[0m`;
            case 3: // cyan = redirect
                return `\x1b[36m${status}\x1b[0m`;
            case 2: // green = success
                return `\x1b[32m${status}\x1b[0m`;
        }
    }
    // Fallback to unsupported status code.
    // E.g.) Bun and Deno supports new Response with 101, but Node.js does not.
    // And those may evolve to accept more status.
    return `${status}`;
};

const colorPrefix = (prefix: LogPrefix) => {
    const colorEnabled = getColorEnabled();
    if (colorEnabled) {
        switch (prefix) {
            case LogPrefix.Incoming: // green
            case LogPrefix.Outgoing:
                return `\x1b[32m${prefix}\x1b[0m`;
            case LogPrefix.Error: // red
                return `\x1b[31m${prefix}\x1b[0m`;
        }
    }
    return prefix;
};

type PrintFunc = (str: string, ...rest: string[]) => void;

function log(fn: PrintFunc, prefix: string, method: string, path: string, status: number = 0, elapsed?: string) {
    const out =
        prefix === LogPrefix.Incoming
            ? `[${new Date().toISOString()}] ${colorPrefix(prefix)} ${method} ${path}`
            : `[${new Date().toISOString()}] ${colorPrefix(prefix as LogPrefix)} ${method} ${path} ${colorStatus(status)} ${elapsed}`;
    fn(out);
}
/* Taken from https://github.com/honojs/hono/blob/main/src/middleware/logger/index.ts */

export const logger = (fn: PrintFunc = console.log): MiddlewareHandler => {
    return async function logger(c, next) {
        const { method } = c.req;

        const path = getPath(c.req.raw);

        log(fn, LogPrefix.Incoming, method, path);

        const start = Date.now();

        await next();

        log(fn, LogPrefix.Outgoing, method, path, c.res.status, time(start));
    };
};

export const customLogger = (message: string, ...rest: string[]) => {
    console.log(message, ...rest);
};
