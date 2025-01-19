import { Hono } from "hono";
import teams from "./admin/teams.js";
import users from "./admin/users.js";

const admin = new Hono();

admin.route("/teams", teams);
admin.route("/users", users);

export default admin;
