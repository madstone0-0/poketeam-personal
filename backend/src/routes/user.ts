import { Hono } from "hono";
import { sendData } from "../utils/utils.js";
import { checkAuth } from "../middleware/auth.js";
import { customLogger } from "../logging.js";
import team from "./user/team.js";
import pokemon from "./user/pokemon.js";

const user = new Hono();

user.get("/ping", checkAuth, (c) => {
    customLogger(`Pong`);
    return c.json(sendData("pong"), 200);
});

user.route("/team", team);
user.route("/pokemon", pokemon);

export default user;
