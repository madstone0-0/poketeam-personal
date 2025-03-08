import { Hono } from "hono";
import { sendMsg, sendSR } from "../../utils/utils.js";
import UserService from "../../services/UserService.js";
import { checkAdminAuth } from "../../middleware/auth.js";

const users = new Hono();

users.use(checkAdminAuth);

users.get("/info", (c) => {
    return c.json(sendMsg("Admin users route"));
});

users.get("/all", async (c) => {
    const sr = await UserService.All();
    return sendSR(c, sr);
});

export default users;
