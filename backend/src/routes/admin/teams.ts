import { Hono } from "hono";
import { sendMsg, sendSR } from "../../utils.js";
import TeamService from "../../services/TeamService.js";
import { checkAdminAuth } from "../../middleware/auth.js";
import PokemonService from "../../services/PokemonService.js";

const teams = new Hono();

teams.use(checkAdminAuth);

teams.get("/info", (c) => {
    return c.json(sendMsg("Admin teams route"));
});

teams.get("/all", async (c) => {
    const sr = await TeamService.All();
    return sendSR(c, sr);
});

teams.get("/all-pokemon", async (c) => {
    const sr = await PokemonService.All();
    return sendSR(c, sr);
});

export default teams;
