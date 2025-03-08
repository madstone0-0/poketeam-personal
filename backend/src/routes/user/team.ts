import { Hono } from "hono";
import { sendMsg, sendSR } from "../../utils/utils.js";
import TeamService from "../../services/TeamService.js";
import {
    createTeamValidator,
    idValidator,
    teamPokemonAddValidator,
    teamPokemonDeleteManyValidator,
    teamPokemonUpdateValidator,
    teamPokemonValidator,
} from "../../validation.js";
import type { ManyNewTeamPokemon, NewPokemon, NewTeam, NewTeamPokemon, UpdatePokemon } from "../../types/index.js";
import { checkAuth } from "../../middleware/auth.js";

const team = new Hono();

team.use(checkAuth);

team.get("/info", (c) => {
    return c.json(sendMsg("Team route"));
});

team.get("/all/:uid", async (c) => {
    const { uid } = c.req.param();
    const sr = await TeamService.ByUID(parseInt(uid));
    return sendSR(c, sr);
});

team.post("/create", createTeamValidator, async (c) => {
    const valid = c.req.valid("json");
    const sr = await TeamService.Create(valid as NewTeam);
    return sendSR(c, sr);
});

team.put("/update", createTeamValidator, async (c) => {
    const valid = c.req.valid("json");
    const sr = await TeamService.Update(valid as NewTeam);
    return sendSR(c, sr);
});

team.delete("/delete/:id", async (c) => {
    const { id } = c.req.param();
    const sr = await TeamService.Delete(parseInt(id));
    return sendSR(c, sr);
});

team.delete("/pokemon-delete", teamPokemonValidator, async (c) => {
    const valid = c.req.valid("json");
    const sr = await TeamService.DeleteTeamPokemon(valid as NewTeamPokemon);
    return sendSR(c, sr);
});

team.get("/pokemon-id/:tid", async (c) => {
    const { tid } = c.req.param();
    const sr = await TeamService.TeamPokemon(parseInt(tid));
    return sendSR(c, sr);
});

team.post("/pokemon-add", teamPokemonAddValidator, async (c) => {
    const valid = c.req.valid("json");
    const sr = await TeamService.AddTeamPokemon(valid as { tid: number; pokemon: NewPokemon[] });
    return sendSR(c, sr);
});

team.put("/pokemon-update", teamPokemonUpdateValidator, async (c) => {
    const valid = c.req.valid("json");
    const sr = await TeamService.UpdateTeamPokemon(valid as UpdatePokemon);
    return sendSR(c, sr);
});

team.delete("/pokemon-delete-many", teamPokemonDeleteManyValidator, async (c) => {
    const valid = c.req.valid("json");
    const sr = await TeamService.DeleteManyTeamPokemon(valid as ManyNewTeamPokemon);
    return sendSR(c, sr);
});

export default team;
