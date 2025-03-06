import React, { useEffect, useReducer } from "react";
import { noneEmpty, resolveError, tryCatch, validate } from "../utils/index";
import { createPortal } from "react-dom";
import { User as UserIcon, Mail, KeyRound, Eye, EyeClosed } from "lucide-react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../Header";
import useStore from "../stores";
import { API_BASE, LOGOUT, SIGNUP } from "../constants";
import { fetch } from "../utils/Fetch";
import { getErrMsgIfExists } from "../utils";
import { useSnackbar } from "notistack";
import { useAdminQueriesAndMutations } from "../utils/queries";
import withLoading from "../WithLoading";
import { useForm } from "@tanstack/react-form";
import Modal from "../Modal";
import TeamGrid from "../TeamGrid";
import Input from "../Input";
import NotFound from "../NotFound";
import { ClickHandler, HeaderIitem, MsgResponse, NewUser, ResponseMaybeProblems, Team, UID, User } from "../../types";

const AdminDash = () => {
    const user = useStore((state) => state.user);
    const reset = useStore((state) => state.reset);
    const username = user.username;
    const nav = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const onLogout: ClickHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch.get(`${API_BASE}${LOGOUT}`);
            const data = res.data;
            enqueueSnackbar(data, { variant: "success" });
            reset();
            nav("/");
        } catch (error) {
            console.error({ error });
            const msg = getErrMsgIfExists(error) || "An error occured";
            console.error({ msg });
            enqueueSnackbar(msg, { variant: "error" });
        }
    };

    const headerItems: HeaderIitem[] = [
        { label: "Home", href: "/home/" },
        { label: "All Users", href: "/admin/users" },
        { label: "All Teams", href: "/admin/teams" },
        { label: "Create Admin", href: "/admin/create-admin" },
    ];

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
                <li key={2}>
                    <a className="link-primary" onClick={onLogout}>
                        Logout
                    </a>
                </li>
            </ul>
        </div>,
    ];

    useEffect(() => {
        if (!user.is_admin) {
            nav("/");
        }
    }, []);

    return (
        <>
            <Header homeLink="/admin/" headerItems={headerItems} miscItems={miscItems} />
            <div className="container p-5 min-w-full min-h-[95vh] bg-base-200">
                <Routes>
                    <Route index element={<AdminIndex />} />
                    <Route path="users" element={<UsersDisplay />} />
                    <Route path="teams" element={<TeamsDisplay />} />
                    <Route path="create-admin" element={<AdminCreate />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </>
    );
};

const AdminCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const form = useForm<NewUser>({
        defaultValues: {
            fname: "",
            lname: "",
            username: "",
            email: "",
            password: "",
            is_admin: true,
        },
        onSubmit: async ({ value }) => {
            await onCreateAdmin(value);
        },
    });

    const [pwdHidden, updatePwdState] = useReducer((hidden) => !hidden, false);

    const togglePwdHidden: ClickHandler = (e) => {
        e.preventDefault();
        const password = document.querySelector("#password")!;
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
        return updatePwdState();
    };

    const onCreateAdmin = async (data: NewUser) => {
        if (!noneEmpty(Array.from(Object.values(data)))) {
            enqueueSnackbar("Please fill in all fields", { variant: "error" });
            return;
        }

        try {
            validate(data["password"], data["email"]);
        } catch (e) {
            resolveError(e, Error, (e) => {
                enqueueSnackbar(`Admin Creation error: ${e.message}`, { variant: "error" });
            });
            return;
        }

        const { error } = await tryCatch(fetch.post<MsgResponse>(`${API_BASE}${SIGNUP}`, data));
        if (!error) {
            enqueueSnackbar("Admin Creation successful", { variant: "success" });
            form.reset();
        } else {
            const msg = getErrMsgIfExists<ResponseMaybeProblems>(error) || error.message;
            if (msg instanceof Object) {
                enqueueSnackbar(`Signup error: ${msg.err}`, { variant: "error" });
                msg.problems.forEach((p: string) => enqueueSnackbar(`${p}`, { variant: "error" }));
            } else {
                enqueueSnackbar(`Signup error: ${msg}`, { variant: "error" });
            }
        }
    };

    return (
        <div className="flex justify-center w-full">
            <form
                className="flex flex-col space-y-3 w-1/2"
                id="signup-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <h1 className="text-3xl font-bold text-center">Create Admin</h1>
                <div className="flex flex-col [&>*]:w-full mb-3 space-y-3 w-full md:flex md:flex-row md:justify-items-center md:space-y-0 md:space-x-3">
                    <form.Field
                        name="fname"
                        children={(field) => (
                            <Input
                                type="text"
                                id="fname"
                                Icon={UserIcon}
                                placeholder="First Name"
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        )}
                    />
                    <form.Field
                        name="lname"
                        children={(field) => (
                            <Input
                                type="text"
                                id="lname"
                                Icon={UserIcon}
                                placeholder="Last Name"
                                name={field.name}
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        )}
                    />
                </div>
                <form.Field
                    name="email"
                    children={(field) => (
                        <Input
                            type="text"
                            id="email"
                            Icon={Mail}
                            placeholder="Email"
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    )}
                />
                <form.Field
                    name="password"
                    children={(field) => (
                        <Input
                            type="password"
                            id="password"
                            Icon={KeyRound}
                            placeholder="Password"
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
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
                    )}
                />
                <form.Field
                    name="username"
                    children={(field) => (
                        <Input
                            type="text"
                            id="username"
                            Icon={UserIcon}
                            placeholder="Username"
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    )}
                />

                <button className="btn btn-primary" type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
};

const AdminIndex = () => {
    const { queries } = useAdminQueriesAndMutations();
    const { usersQuery, teamsQuery, pokemonQuery } = queries;

    return (
        <div className="flex flex-col space-y-5 w-full h-full">
            <div className="flex flex-row w-full">
                <div className="w-full shadow stats">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <UserIcon size={32} />
                        </div>
                        <div className="stat-title">Users</div>
                        <div className="stat-value">
                            {usersQuery.isLoading ? "Loading..." : usersQuery.data ? usersQuery.data.length : 0}
                        </div>
                        <div className="stat-desc">All time</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                width={32}
                                height={32}
                                strokeWidth={2}
                            >
                                {" "}
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>{" "}
                                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path> <path d="M3 12h6"></path>{" "}
                                <path d="M15 12h6"></path>{" "}
                            </svg>
                        </div>
                        <div className="stat-title">Teams</div>
                        <div className="stat-value">
                            {teamsQuery.isLoading ? "Loading..." : teamsQuery.data ? teamsQuery.data.length : 0}
                        </div>
                        <div className="stat-desc">All Time</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                width={32}
                                height={32}
                                strokeWidth={2}
                            >
                                {" "}
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>{" "}
                                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path> <path d="M3 12h6"></path>{" "}
                                <path d="M15 12h6"></path>{" "}
                            </svg>
                        </div>
                        <div className="stat-title">Pokemon</div>
                        <div className="stat-value">
                            {pokemonQuery.isLoading ? "Loading..." : pokemonQuery.data ? pokemonQuery.data.length : 0}
                        </div>
                        <div className="stat-desc">In All Teams</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamsDisplay = () => {
    const { queries } = useAdminQueriesAndMutations();
    const { teamsQuery } = queries;

    useEffect(() => {
        teamsQuery.refetch();
    }, []);

    type MainProps = {
        teams?: Team[];
    };

    const Main = ({ teams }: MainProps) => {
        if (!teams) return <div>No teams found</div>;

        // TODO: Replace with map
        const teamsByUser: { uid: UID; user: Team["user"]; teams: Team[] }[] = [];
        for (const team of teams) {
            let user = teamsByUser.find((u) => u.uid === team.uid);
            if (!user) {
                user = { uid: team.uid, user: team.user, teams: [] };
                teamsByUser.push(user);
            }
            user.teams.push(team);
        }

        return (
            <>
                {teamsByUser.map((user) => (
                    <div className="w-full shadow-xl card bg-base-100">
                        <div className="card-body">
                            <h2 className="card-title">
                                {user.user.fname} {user.user.lname}{" "}
                                <span className="text-sm text-gray-500">#{user.uid}</span>
                            </h2>
                            {user.teams ? (
                                <TeamGrid showControls={{ create: false, del: true }} teams={user.teams} />
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                ))}
            </>
        );
    };

    return withLoading(Main)({ loading: teamsQuery.isLoading, teams: teamsQuery.data });
};

const UsersDisplay = () => {
    const { queries, mutations } = useAdminQueriesAndMutations();
    const { usersQuery } = queries;
    const { userDeleteMutation, userEditMutation } = mutations;

    const onUserDelete = async (uid: UID) => {
        try {
            await userDeleteMutation.mutateAsync(uid);
        } catch (e) {
            console.error({ e });
        }
    };

    const onUserEdit = async (data: User) => {
        try {
            await userEditMutation.mutateAsync(data);
        } catch (e) {
            console.error({ e });
        }
    };

    const handleDelete = async <T extends React.UIEvent>(e: T, callback: () => void) => {
        e.preventDefault();
        const modal = document.getElementById("confirmDeleteModal")! as HTMLDialogElement;
        const deleteButton = modal.querySelector("#deleteButton")! as HTMLButtonElement;
        const cancelButton = modal.querySelector("#cancelButton")! as HTMLButtonElement;

        deleteButton.onclick = () => {
            modal.close();
            callback();
        };

        cancelButton.onclick = () => {
            modal.close();
        };

        modal.showModal();
    };

    const editForm = useForm<User>({
        defaultValues: {
            uid: 0,
            fname: "",
            lname: "",
            username: "",
            email: "",
            is_admin: false,
            password: "",
        },

        onSubmit: async ({ value }) => {
            await onUserEdit(value);
        },
    });

    const handleEdit = async <T extends React.UIEvent>(e: T, user: User) => {
        e.preventDefault();
        editForm.setFieldValue("uid", user.uid);
        editForm.setFieldValue("fname", user.fname);
        editForm.setFieldValue("lname", user.lname);
        editForm.setFieldValue("username", user.username);
        editForm.setFieldValue("email", user.email);
        editForm.setFieldValue("is_admin", user.is_admin);

        const modal = document.getElementById("updateModal")! as HTMLDialogElement;
        const cancelButton = modal.querySelector("#cancelButton") as HTMLButtonElement;

        cancelButton.onclick = () => {
            modal.close();
        };

        modal.showModal();
    };

    const Main = ({ users }: { users?: User[] }) => {
        if (!users) return <div>No users found</div>;
        return (
            <>
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.uid}>
                                    <td>{user.uid}</td>
                                    <td>
                                        {user.fname} {user.lname}
                                    </td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className="flex flex-col space-y-2 w-full align-middle md:flex-row md:space-y-0 md:space-x-2 md:w-1/2">
                                            <button
                                                onClick={(e) => {
                                                    handleEdit(e, user);
                                                }}
                                                className="w-full btn btn-primary"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(e, () => onUserDelete(user.uid))}
                                                className="w-full btn btn-error"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {createPortal(
                    <Modal id="confirmDeleteModal" title="Are you Sure?">
                        <p className="py-4">Are you sure you want to delete this User?</p>
                        <div className="modal-action">
                            <button id="deleteButton" className="btn btn-error">
                                Delete
                            </button>
                            <button id="cancelButton" className="btn btn-ghost">
                                Cancel
                            </button>
                        </div>
                    </Modal>,
                    document.body,
                )}

                {createPortal(
                    <Modal id="updateModal" title="Edit User">
                        <form
                            id="editForm"
                            className="flex flex-col items-center space-y-3 w-full h-full form-control"
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                editForm.handleSubmit();
                            }}
                        >
                            <editForm.Field
                                name="fname"
                                children={(field) => (
                                    <Input
                                        labelClassname="w-full"
                                        className="w-1/2"
                                        Icon={() => <h1 className="font-bold">First Name</h1>}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />

                            <editForm.Field
                                name="lname"
                                children={(field) => (
                                    <Input
                                        labelClassname="w-full"
                                        className="w-1/2"
                                        Icon={() => <h1 className="font-bold">Last Name</h1>}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />

                            <editForm.Field
                                name="email"
                                children={(field) => (
                                    <Input
                                        labelClassname="w-full"
                                        className="w-1/2"
                                        Icon={() => <h1 className="font-bold">Email</h1>}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />

                            <editForm.Field
                                name="username"
                                children={(field) => (
                                    <Input
                                        labelClassname="w-full"
                                        className="w-1/2"
                                        Icon={() => <h1 className="font-bold">Username</h1>}
                                        name={field.name}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                            />
                            <editForm.Field
                                name="is_admin"
                                children={(field) => (
                                    <div className="flex flex-row space-x-4 w-full">
                                        <label>Admin</label>
                                        <input
                                            id="is_admin"
                                            type="checkbox"
                                            checked={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.checked)}
                                            className="checkbox checkbox-primary"
                                        />
                                    </div>
                                )}
                            />
                            <div className="flex flex-row justify-between modal-action">
                                <button className="w-1/2 btn btn-error" type="submit">
                                    Save
                                </button>
                                <button type="reset" id="cancelButton" className="w-1/2 btn btn-ghost">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </Modal>,
                    document.body,
                )}
            </>
        );
    };

    return withLoading(Main)({ loading: usersQuery.isLoading, users: usersQuery.data });
};

export default AdminDash;
