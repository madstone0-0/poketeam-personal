import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { prettyPrint, sendError } from "../utils/utils.js";
import { customLogger } from "../logging.js";
import type { UserData } from "../types/index.js";

export const checkAuth: MiddlewareHandler = async (c, next) => {
    const userCookie = getCookie(c, "user");
    if (!userCookie) return c.json(sendError("Unauthorized"), 401);

    const user: UserData = JSON.parse(userCookie);
    if (!user.uid) return c.json(sendError("Unauthorized"), 401);

    await next();
};

export const checkAdminAuth: MiddlewareHandler = async (c, next) => {
    const userCookie = getCookie(c, "user");
    if (!userCookie) {
        return c.json(sendError("Unauthorized"), 401);
    }

    const user: UserData = JSON.parse(userCookie);
    customLogger(`User: ${prettyPrint(user)}`);
    if (!user.isAdmin) return c.json(sendError("Unauthorized"), 401);

    await next();
};
