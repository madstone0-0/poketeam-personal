import { API_BASE } from "../constants";
import { fetch } from "./Fetch";

export const noneEmpty = (arr) => {
    return arr.every((item) => item !== "");
};

export const validate = (password, email) => {
    const emailRegex = /(\w+)@(\w+).(\w{2,})/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

    if (!emailRegex.test(email)) {
        throw Error("Invalid email address");
    }

    if (!passwordRegex.test(password)) {
        throw Error(
            "Invalid password\nYour password should be between 8 and 32 characters and not contain long repeating seqeunces",
        );
    }
};

export const ping = async () => {
    try {
        const res = await fetch.get(`${API_BASE}/user/ping`);

        if (res.status !== 200) {
            return false;
        }

        return true;
    } catch (e) {
        console.error({ e });
        return false;
    }
};

export const handlePing = async (callback) => {
    if (!(await ping())) {
        callback();
    }
};

export const getErrMsgIfExists = (e) => {
    try {
        if (e.response) {
            return e.response.data.err;
        }
    } catch (er) {
        return null;
    }
    return null;
};
