import { Hono } from "hono";
import { sendData, sendMsg, sendSR } from "../utils.js";
import UserService from "../services/UserService.js";
import type { NewUser, UserDB } from "../types.js";
import { loginValidator, signUpValidator, userUpdateValidator } from "../validation.js";
import { deleteCookie, setCookie } from "hono/cookie";
import { customLogger } from "../logging.js";

const auth = new Hono();

auth.get("/info", (c) => c.json(sendMsg("Auth Route")));

auth.post("/signup", signUpValidator, async (c) => {
    const valid = c.req.valid("json");
    const user: NewUser = {
        ...valid,
        passhash: valid.password,
        uname: valid.username,
    };
    const sr = await UserService.SignUp(user);
    return sendSR(c, sr);
});

auth.put("/update", userUpdateValidator, async (c) => {
    const valid = c.req.valid("json");
    const sr = await UserService.Update(valid as UserDB);
    return sendSR(c, sr);
});

auth.get("/logout", (c) => {
    const res = deleteCookie(c, "userId");
    customLogger(`Cookie deleted: ${res}`);
    return c.json(sendData("Logged out"));
});

auth.delete("/delete/:id", async (c) => {
    const { id } = c.req.param();
    const res = deleteCookie(c, "userId");
    customLogger(`Cookie deleted: ${res}`);
    const sr = await UserService.Delete(parseInt(id));
    return sendSR(c, sr);
});

auth.post("/login", loginValidator, async (c) => {
    const valid = c.req.valid("json");
    const sr = await UserService.Login(valid);
    return sendSR(c, sr, async () => {
        if (sr.data) {
            customLogger("Set Login Coookie");
            const { ["passhash"]: nope, ...rest } = sr.data;
            setCookie(
                c,
                "user",
                JSON.stringify({
                    ...rest,
                }),
                {
                    maxAge: 10 * 60 * 60, // 10 mins
                },
            );
        }
    });
});

export default auth;
