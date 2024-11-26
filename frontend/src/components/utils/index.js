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

export const getErrMsgIfExists = (e) => {
    try {
        if (e.response) {
            return e.response.data;
        }
    } catch (er) {
        return null;
    }
    return null;
};
