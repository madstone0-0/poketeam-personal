import React, { useEffect, useState } from "react";
import Header from "../Header";
import { fetch } from "../utils/Fetch";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import { API_BASE, LOGOUT } from "../constants";
import { getErrMsgIfExists, getStringDate, handlePing } from "../utils";
import { useSnackbar } from "notistack";
import useStore from "../stores";
import TeamGrid from "../TeamGrid";
import TeamPage from "../TeamPage";
import TeamSingle from "../TeamSingle";
import PokemonSingle from "../PokemonSingle";
import PokemonSpotlight from "../PokemonSpotlight";
import Profile from "../Profile";
import NotFound from "../NotFound";
import { useUserQueriesAndMutations } from "../utils/queries";
import { ClickHandler, UserTeam } from "../../types";

const Home = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [teams, setTeams] = useState<UserTeam[]>([]);
    const navigate = useNavigate();
    const selectedPokemon = useStore((state) => state.selectedPokemon);
    // const setSelectedPokemon = useStore((state) => state.setSelectedPokemon);

    const user = useStore((state) => state.user);
    const selectedTeam = useStore((state) => state.selectedTeam);
    const { uname, uid } = user;
    const reset = useStore((state) => state.reset);
    const { queries } = useUserQueriesAndMutations({ uid: uid!, tid: selectedTeam });
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

    const onLogout: ClickHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch.get(`${API_BASE}${LOGOUT}`);
            const data = res.data;
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

    let headerItems = [];
    if (user.isAdmin) {
        headerItems = [
            { label: "Teams", href: "/home/teams" },
            { label: "Admin", href: "/admin/" },
        ];
    } else {
        headerItems = [{ label: "Teams", href: "/home/teams" }];
    }

    const miscItems = [
        <div key={96} className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="rounded-full hover:cursor-pointer btn btn-ghost avatar placeholder"
            >
                <div className="w-10 rounded-full bg-neutral text-neutral-content">
                    <span className="text-3xl">{uname ? uname[0].toUpperCase() : "U"}</span>
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
                    <Route path="profile" element={<Profile user={user} />} />
                    <Route path="teams/:tid" element={<TeamSingle />} />
                    <Route
                        path="teams/:tid/pokemon/:pid"
                        element={<PokemonSingle selectedPokemon={selectedPokemon} />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </>
    );
};

const HomeContent = ({ teams }: { teams: UserTeam[] }) => {
    teams = teams || [];

    return (
        <>
            <PokemonSpotlight />
            <div className="w-full shadow-xl min-h-32 card">
                <div className="card-body">
                    <h2 className="text-2xl card-title">Recently Added Teams</h2>
                    {teams.length === 0 ? (
                        <div>No Teams yet</div>
                    ) : (
                        <TeamGrid
                            teams={teams}
                            limit={3}
                            showControls={{ view: true }}
                            sortBy={(a, b) => {
                                return getStringDate(a.updatedAt).getTime() - getStringDate(b.updatedAt).getTime();
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
