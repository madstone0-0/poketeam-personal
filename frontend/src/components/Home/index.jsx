import React, { useEffect } from "react";
import Header from "../Header";
import { fetch } from "../utils/Fetch";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { API_BASE, LOGOUT } from "../constants";
import { getErrMsgIfExists, handlePing } from "../utils";
import { useSnackbar } from "notistack";
import { usePoke } from "../utils/hooks";

const Home = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { reset, uidState, usernameState } = usePoke();
    const { uid } = uidState;
    const { username } = usernameState;

    const onLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch.get(`${API_BASE}${LOGOUT}`);
            console.log({ res });
            const data = res.data;
            enqueueSnackbar(data, { variant: "success" });
            reset();
            navigate("/");
        } catch (error) {
            console.error({ error });
            const msg = getErrMsgIfExists(error) || "An error occured";
            enqueueSnackbar(msg, { variant: "error" });
        }
    };

    const headerItems = [{ label: "Teams", href: "/home/teams" }];

    const miscItems = [
        <li className="items-center" key={69}></li>,
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="rounded-full hover:cursor-pointer btn btn-ghost avatar placeholder"
            >
                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                    <span className="text-3xl">{username ? username[0].toUpperCase() : "U"}</span>
                </div>
            </div>
            <ul tabIndex={0} className="p-2 w-52 shadow menu dropdown-content bg-base-100 rounded-box z-[1]">
                <li>
                    <Link to="/home/profile">Profile</Link>
                </li>
                <li>
                    <a className="link-primary" onClick={onLogout}>
                        Logout
                    </a>
                </li>
            </ul>
        </div>,
    ];

    useEffect(() => {
        if (!uid) {
            navigate("/");
        }

        handlePing(() => {
            reset();
            navigate("/");
        });
    }, []);

    useEffect(() => {
        if (!uid) {
            navigate("/");
        }
    }, [uid]);

    return (
        <>
            <Header homeLink="/home" headerItems={headerItems} miscItems={miscItems} />

            <div className="container p-5 min-w-full min-h-screen bg-base-200">
                <Routes>
                    <Route index element={<div>Home</div>} />
                    <Route path="teams" element={<div>Teams</div>} />
                    <Route path="profile" element={<div>Profile</div>} />
                    <Route path="*" element={<div>404</div>} />
                </Routes>
            </div>
        </>
    );
};

export default Home;
