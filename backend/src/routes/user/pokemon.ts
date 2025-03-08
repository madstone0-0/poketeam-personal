import { Hono } from "hono";
import { sendMsg, sendSR } from "../../utils/utils.js";
import { pokemonSearchValidator } from "../../validation.js";
import PokemonService from "../../services/PokemonService.js";
import { checkAuth } from "../../middleware/auth.js";
import MovesService from "../../services/MovesService.js";
import StatsService from "../../services/StatsService.js";

const pokemon = new Hono();

pokemon.use(checkAuth);

pokemon.get("/info", (c) => {
    return c.json(sendMsg("Pokemon route"));
});

pokemon.post("/search", pokemonSearchValidator, async (c) => {
    const valid = c.req.valid("json");
    const sr = await PokemonService.ByName(valid);
    return sendSR(c, sr);
});

pokemon.get("/id/:id", async (c) => {
    const { id } = c.req.param();
    const sr = await PokemonService.ById(parseInt(id));
    return sendSR(c, sr);
});

pokemon.get("/moves/:pid", async (c) => {
    const { pid } = c.req.param();
    const sr = await MovesService.FetchByPid(parseInt(pid));
    return sendSR(c, sr);
});

pokemon.get("/move-info/:mid", async (c) => {
    const { mid } = c.req.param();
    const sr = await MovesService.FetchByMid(parseInt(mid));
    return sendSR(c, sr);
});

pokemon.get("/stats/:pid", async (c) => {
    const { pid } = c.req.param();
    const sr = await StatsService.FetchById(parseInt(pid));
    return sendSR(c, sr);
});

export default pokemon;
