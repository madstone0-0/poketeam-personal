import { Hono } from "hono";
import { sendMsg } from "../utils.js";

const auth = new Hono();

auth.get("/info", (c) => c.json(sendMsg("Auth Route")));

export default auth;
