import React, { useEffect } from "react";
import Header from "../Header";
import { fetch } from "../utils/Fetch";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { API_BASE, LOGOUT } from "../constants";
import { getErrMsgIfExists, handlePing } from "../utils";
import { useSnackbar } from "notistack";
import { usePoke } from "../utils/hooks";
import { getTeams } from "../utils/api";
import TeamGrid from "../TeamGrid";
import TeamPage from "../TeamPage";
import TeamSingle from "../TeamSingle";
import { useUserQueriesAndMutations } from "../utils/queries";

const Home = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { reset, uidState, usernameState, teamsState } = usePoke();
    const { uid } = uidState;
    const { username } = usernameState;
    const { teams, setTeams } = teamsState;
    const { queries, mutations } = useUserQueriesAndMutations({ uid });
    const { teamsQuery } = queries;

    useEffect(() => {
        if (!uid) {
            navigate("/");
        }

        handlePing(() => {
            reset();
            navigate("/");
        });

        if (teamsQuery.data) {
            setTeams(teamsQuery.data);
        }

        return () => {
            closeSnackbar();
        };
    }, []);

    useEffect(() => {
        if (teamsQuery.data) {
            setTeams(teamsQuery.data);
        }
    }, [teamsQuery.data]);

    const onLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch.get(`${API_BASE}${LOGOUT}`);
            console.log({ res });
            const data = res.data;
            console.log({ data });
            enqueueSnackbar(data, { variant: "success" });
            reset();
            navigate("/");
        } catch (error) {
            console.error({ error });
            const msg = getErrMsgIfExists(error) || "An error occured";
            console.error({ msg });
            enqueueSnackbar(msg, { variant: "error" });
        }
    };

    const headerItems = [{ label: "Teams", href: "/home/teams" }];

    const miscItems = [
        <div key={96} className="dropdown dropdown-end">
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
                <li key={1}>
                    <Link to="/home/profile">Profile</Link>
                </li>
                <li key={2}>
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
    }, [uid]);

    return (
        <>
            <Header homeLink="/home" headerItems={headerItems} miscItems={miscItems} />

            <div className="container p-5 min-w-full min-h-[95vh] bg-base-200">
                <Routes>
                    <Route index element={<HomeContent teams={teams} />} />
                    <Route path="teams" element={<TeamPage />} />
                    <Route path="profile" element={<div>Profile</div>} />
                    <Route path="teams/:tid" element={<TeamSingle />} />
                    <Route path="*" element={<div>404</div>} />
                </Routes>
            </div>
        </>
    );
};

const HomeContent = ({ teams }) => {
    teams = teams || [];

    return <TeamGrid teams={teams} limit={3} showControls={false} />;
};

export default Home;
