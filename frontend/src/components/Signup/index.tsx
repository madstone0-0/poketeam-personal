import React, { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Eye, EyeClosed, User } from "lucide-react";
import { useSnackbar } from "notistack";
import { API_BASE, SIGNUP } from "../constants";
import { fetch } from "../utils/Fetch";
import { validate, noneEmpty, getErrMsgIfExists } from "../utils";
import Input from "../Input";
import Header from "../Header";
import { ChangeHandler, ClickHandler, HeaderIitem, MsgResponse } from "../../types";

type SignupProps = {
    headerItems: HeaderIitem[];
};

const Signup = ({ headerItems }: SignupProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const [email, updateEmail] = useState("");
    const [username, updateUsername] = useState("");
    const [fname, updateFname] = useState("");
    const [lname, updateLname] = useState("");
    const [password, updatePassword] = useState("");
    const [pwdHidden, updatePwdState] = useReducer((hidden) => !hidden, false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onEmailChange: ChangeHandler = (e) => {
        e.preventDefault();
        return updateEmail(e.target.value);
    };

    const onPasswordChange: ChangeHandler = (e) => {
        e.preventDefault();
        return updatePassword(e.target.value);
    };

    const onUsernameChange: ChangeHandler = (e) => {
        e.preventDefault();
        return updateUsername(e.target.value);
    };

    const onFnameChange: ChangeHandler = (e) => {
        e.preventDefault();
        return updateFname(e.target.value);
    };

    const onLnameChange: ChangeHandler = (e) => {
        e.preventDefault();
        return updateLname(e.target.value);
    };

    const togglePwdHidden: ClickHandler = (e) => {
        e.preventDefault();
        const password = document.querySelector("#password")! as HTMLInputElement;
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
        return updatePwdState();
    };

    const onSignup: ClickHandler<HTMLFormElement> = async (e) => {
        setLoading(true);
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        // const data = { ...Object.fromEntries(formData.entries()), isAdmin: 0 };
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value as string;
        });
        data["isAdmin"] = "0";

        if (!noneEmpty(Array.from(Object.values(data)))) {
            enqueueSnackbar("Please fill in all fields", { variant: "error" });
            setLoading(false);
            return;
        }

        try {
            validate(data["password"], data["email"]);
        } catch (e) {
            const err = e as Error;
            enqueueSnackbar(`Signup error: ${err.message}`, { variant: "error" });
            setLoading(false);
            return;
        }

        try {
            await fetch.post<MsgResponse>(`${API_BASE}${SIGNUP}`, data);
            enqueueSnackbar("Signup successful", { variant: "success" });

            updateEmail("");
            updatePassword("");
            updateUsername("");
            updateFname("");
            updateLname("");
            setLoading(false);
            navigate("/login");
        } catch (e) {
            const msg = getErrMsgIfExists<string | { err: string; problems: string[] }>(e) || (e as Error).message;
            if (typeof msg === "object" && msg !== null) {
                enqueueSnackbar(`Signup error: ${msg.err}`, { variant: "error" });
                msg.problems.forEach((p: string) => enqueueSnackbar(p, { variant: "error" }));
            } else {
                enqueueSnackbar(`Signup error: ${msg}`, { variant: "error" });
            }
            setLoading(false);
        }
    };

    return (
        <>
            <Header headerItems={headerItems} />
            <div className="flex flex-col m-auto mt-20 max-w-fit min-w-10">
                <form className="flex flex-col space-y-3" id="signup-form" onSubmit={onSignup}>
                    <h1 className="text-3xl font-bold text-center">Signup</h1>
                    <div className="flex flex-col [&>*]:w-full mb-3 space-y-3 w-full md:flex md:flex-row md:justify-items-center md:space-y-0 md:space-x-3">
                        <Input
                            type="text"
                            id="fname"
                            Icon={User}
                            placeholder="First Name"
                            value={fname}
                            onChange={onFnameChange}
                        />
                        <Input
                            type="text"
                            id="lname"
                            Icon={User}
                            placeholder="Last Name"
                            value={lname}
                            onChange={onLnameChange}
                        />
                    </div>
                    <Input
                        type="text"
                        id="email"
                        Icon={Mail}
                        placeholder="Email"
                        value={email}
                        onChange={onEmailChange}
                    />
                    <Input
                        type="password"
                        id="password"
                        Icon={KeyRound}
                        placeholder="Password"
                        value={password}
                        onChange={onPasswordChange}
                        extra={[
                            <button
                                type="button"
                                key="pwd-toggle"
                                className="btn btn-circle btn-ghost"
                                onClick={togglePwdHidden}
                                aria-label="Toggle password visibility"
                            >
                                {pwdHidden ? <Eye /> : <EyeClosed />}
                            </button>,
                        ]}
                    />
                    <Input
                        type="text"
                        id="username"
                        Icon={User}
                        placeholder="Username"
                        value={username}
                        onChange={onUsernameChange}
                    />
                    <button disabled={loading} className="btn btn-primary" type="submit">
                        Sign Up
                    </button>
                </form>
            </div>
        </>
    );
};

export default Signup;
