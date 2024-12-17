import { API_BASE } from "../constants";
import { fetch } from "./Fetch";

export const getDateString = (date) => {
    return date.toISOString().split("T")[0];
};

export const getStringDate = (date) => {
    return new Date(date);
};

export const noneEmpty = (arr) => {
    return arr.every((item) => item !== "");
};

export const formatPokemonName = (name) => {
    let formatted = name.indexOf("-") !== -1 ? name.split("-").join(" ") : name;
    formatted = formatted[0].toUpperCase() + formatted.slice(1);
    return formatted;
};

export const validate = (password, email) => {
    const emailRegex = /(\w+)@(\w+).(\w{2,})/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;
    const passwordRegexes = [
        {
            msg: "Must be at least 8 characters long",
            regex: /.{8,}/,
        },
        {
            msg: "Must have at least one uppercase letter",
            regex: /[A-Z]/,
        },
        {
            msg: "Must include at least 3 digits",
            regex: /^(?=(.*\d.*){3,})/,
        },
        {
            msg: "Must contain at least one special character",
            regex: /[!@#$%^&*()\-_=+\[\]{};:'",<.>\/?\\|`~]/,
        },
    ];

    if (!emailRegex.test(email)) {
        throw Error("Invalid email address");
    }

    let problems = [];
    let result = true;

    const boolArr = passwordRegexes.map((item) => {
        const { msg, regex } = item;
        const matchRes = regex.test(password);
        if (!matchRes) problems.push(msg);
        if (result) {
            result = matchRes;
        }
    });

    if (!result) {
        throw Error(problems.join("\n"));
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
