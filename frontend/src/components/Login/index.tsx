import React, { useState, useReducer, FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, KeyRound, Eye, EyeClosed } from "lucide-react";
import { useSnackbar } from "notistack";
import { API_BASE, LOGIN } from "../constants";
import useStore from "../stores";
import { fetch } from "../utils/Fetch";
import { validate, noneEmpty, getErrMsgIfExists } from "../utils";
import "./index.css";
import Input from "../Input";
import Header from "../Header";
import { ChangeHandler, ClickHandler, HeaderIitem, ResponseMaybeProblems, User } from "../../types";

export type LoginProps = {
    headerItems: HeaderIitem[];
};

const Login = ({ headerItems }: LoginProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const [email, updateEmailLocal] = useState("");
    const [password, updatePassword] = useState("");
    const [pwdHidden, updatePwdState] = useReducer((hidden) => !hidden, false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const reset = useStore((state) => state.reset);

    const onEmailChange: ChangeHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        return updateEmailLocal(e.target.value);
    };

    const onPasswordChange: ChangeHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        return updatePassword(e.target.value);
    };

    const togglePwdHidden: ClickHandler = (e) => {
        e.preventDefault();
        const password = document.querySelector("#password")! as HTMLInputElement;
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
        return updatePwdState();
    };

    const onLogin: FormEventHandler = async (e) => {
        setLoading(true);
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value as string;
        });

        if (!noneEmpty(Array.from(Object.values(data)))) {
            enqueueSnackbar("Please fill in all fields", { variant: "error" });
            setLoading(false);
            return;
        }

        try {
            validate(data["password"], data["email"]);
        } catch (e) {
            setLoading(false);
            const err = e as Error;
            enqueueSnackbar(`Login error: ${err.message}`, { variant: "error" });
            return;
        }

        try {
            const res = await fetch.post<User>(`${API_BASE}${LOGIN}`, data);

            enqueueSnackbar("Login successful", { variant: "success" });
            const d = res.data;
            updateEmailLocal("");
            updatePassword("");

            reset({
                username: d.uname,
                email: d.email,
                fname: d.fname,
                lname: d.lname,
                uid: d.uid,
                admin: d.isAdmin,
            });

            setLoading(false);
            navigate(`/home/`);
        } catch (e) {
            setLoading(false);
            const msg = getErrMsgIfExists<ResponseMaybeProblems>(e) || (e as Error).message;
            if (msg instanceof Object) {
                enqueueSnackbar(`Login error: ${msg.err}`, { variant: "error" });
            } else {
                enqueueSnackbar(`Login error: ${msg}`, { variant: "error" });
            }
        }
    };

    return (
        <>
            <Header headerItems={headerItems} />
            <div className="flex flex-col m-auto mt-20 max-w-fit">
                <form className="flex flex-col space-y-3" id="login-form" onSubmit={onLogin}>
                    <h1 className="text-3xl font-bold text-center">Login</h1>
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
                    <button disabled={loading} className="btn btn-primary" type="submit">
                        Login
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;
