import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { customLogger } from "./logging.js";
import { resolveError, sendData, sendSR } from "./utils.js";
import { HEALTH_TEXT } from "./constants.js";
import auth from "./routes/auth.js";
import admin from "./routes/admin.js";
import user from "./routes/user.js";

const app = new Hono();
app.use(logger(customLogger));
app.use(
    cors({
        origin: ["http://localhost:5173"],
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        credentials: true,
        maxAge: 3600,
    }),
);

app.use("/", async (c, next) => {
    try {
        await next();
    } catch (e) {
        const err = resolveError(e);
        customLogger(`Error -> ${err.stack}`);
    }
});

app.get("/health", (c) => {
    return sendSR(c, {
        status: 200,
        data: {
            status: HEALTH_TEXT,
        },
    });
});

app.get("/info", (c) => {
    return sendSR(c, {
        status: 200,
        ...sendData("Welcome to the Poketeam API"),
    });
});

app.route("/auth", auth);
app.route("/admin", admin);
app.route("/user", user);

const port = 8000;
console.log(`Server is running on http://localhost:${port}`);
serve({
    fetch: app.fetch,
    port,
});
