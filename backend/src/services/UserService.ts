import type { RowList, Row } from "postgres";
import db from "../db/db.js";
import type { MessageReturn, NewUser, PromiseReturn, User, UserData, UserDB } from "../types/index.js";
import { handleServerError, prettyPrint, sendMsg, ServiceError } from "../utils/utils.js";
import { hash, compare } from "bcrypt";
import { HASH_ROUNDS } from "../constants.js";
import { customLogger } from "../logging.js";

class UserService {
    async doesUserExist(email?: string, id?: number) {
        if (email === undefined && id == undefined) throw new Error("Need to specifiy either user email or id");

        let res: RowList<Row[]>;
        if (id !== undefined) res = await db`select uid from "user" where uid = ${id}`;
        else res = await db`select email from "user" where email = ${email!}`;
        return res.length > 0;
    }

    private async isUsernameTaken(uname: string) {
        const res = await db`select username from "user" where username = ${uname}`;
        return res.length > 0;
    }

    async SignUp(user: NewUser): PromiseReturn<{ msg: string }> {
        try {
            customLogger(prettyPrint(user));
            const { passhash: password, uname, email } = user;
            if (await this.doesUserExist(email)) {
                throw new ServiceError("User already exists", 400);
            }

            if (await this.isUsernameTaken(uname)) {
                throw new ServiceError("Username already taken", 400);
            }

            const passhash = await hash(password, HASH_ROUNDS);
            const insertUser = {
                ...user,
                password: passhash,
            };

            const query = await db`insert
	into
	"user" (fname,
	lname,
	username,
	email,
	passhash,
	is_admin) values ${db(insertUser, "fname", "lname", "uname", "email", "password", "isAdmin")}`;

            customLogger(`SignUp Query ->\n${prettyPrint(query)}`);

            return {
                status: 201,
                ...sendMsg("User created successfully"),
            };
        } catch (e) {
            return handleServerError(e, "SignUp");
        }
    }

    async Login(user: User): PromiseReturn<UserData> {
        try {
            const { password, email } = user;
            if (!(await this.doesUserExist(email))) {
                throw new ServiceError("User does not exist", 404);
            }

            const res = (await db<UserDB[]>`select * from "user" where email = ${email}`)[0];
            const { passhash, username, is_admin, ...rest } = res;
            const loginUser: UserData = {
                ...rest,
                uname: username,
                isAdmin: is_admin,
            };

            customLogger(prettyPrint(user));
            customLogger(prettyPrint(res));

            if (!(await compare(password, passhash))) throw new ServiceError("Incorrect password", 401);

            return {
                status: 200,
                data: {
                    ...loginUser,
                },
            };
        } catch (e) {
            return handleServerError(e, "Login");
        }
    }

    async Delete(userId: number): PromiseReturn<MessageReturn> {
        try {
            if (!(await this.doesUserExist(undefined, userId))) {
                throw new ServiceError("User does not exist", 404);
            }

            const res = await db`delete from "user" where uid = ${userId}`;
            customLogger(prettyPrint(res));

            return {
                status: 200,
                data: {
                    msg: "User successfully deleted",
                },
            };
        } catch (e) {
            return handleServerError(e, "User Delete");
        }
    }

    async Update(data: UserDB): PromiseReturn<MessageReturn> {
        try {
            const { uid } = data;
            if (!(await this.doesUserExist(undefined, uid))) throw new ServiceError("User does not exist", 404);

            const res =
                await db`update "user" set ${db(data, "is_admin", "username", "fname", "lname", "email")} where uid = ${uid}`;

            return {
                status: 200,
                data: {
                    msg: "Successfully updated user",
                },
            };
        } catch (e) {
            return handleServerError(e, "User Update");
        }
    }

    async All(): PromiseReturn<UserDB[]> {
        try {
            const res = await db<UserDB[]>`select * from "user"`;

            return {
                status: 200,
                data: res,
            };
        } catch (e) {
            return handleServerError(e, "UserAll");
        }
    }
}

export default new UserService();
