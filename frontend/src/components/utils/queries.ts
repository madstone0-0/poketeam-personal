import { useQueryClient, useQuery, useMutation } from "react-query";
import { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import {
    deleteTeamById,
    getTeams,
    createTeam,
    updateTeamById,
    getTeamInfoById,
    addTeamPokemon,
    deleteTeamPokemon,
    deleteManyTeamPokemon,
    updateTeamPokemon,
    getAllUsers,
    deleteUser,
    getAllTeams,
    updateUser,
    getAllPokemon,
} from "./api";
import { useNavigate } from "react-router-dom";
import { MsgResponse } from "../../types";

export const doOnError = <E = Error>(err: E, feebackFn: (msg: string, code: number) => void) => {
    let err_msg = "";
    let err_code = 0;
    if (err instanceof AxiosError) {
        err_msg = err.response?.data.msg;
        err_code = err.response?.status || 404;

        if (err_msg === undefined) err_msg = err.message;
    } else if (err instanceof Error) {
        err_msg = err.message;
    } else {
        err_msg = "Unknown error";
    }

    feebackFn(err_msg, err_code);
};

export const doOnSuccessMsg = async (
    res: MsgResponse,
    queryKey: string,
    callback: (msg: string, queryKey: string) => Promise<void>,
) => {
    const msg = res.msg;
    await callback(msg, queryKey);
};

const useAdminQueriesAndMutations = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const nav = useNavigate();

    const usersQuery = useQuery({
        queryKey: "users",
        queryFn: () => getAllUsers(),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to get users: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
        staleTime: 10000,
        refetchInterval: 30000,
    });

    const teamsQuery = useQuery({
        queryKey: "allTeams",
        queryFn: () => getAllTeams(),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to get teams: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
        staleTime: 10000,
        refetchInterval: 300000,
    });

    const pokemonQuery = useQuery({
        queryKey: "allPokemon",
        queryFn: () => getAllPokemon(),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to get teams: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
        staleTime: 10000,
        refetchInterval: 300000,
    });

    const userDeleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "users", async (msg, queryKey) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey });
            }),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to delete user: ${msg}`, {
                    variant: "error",
                });
                if (code === 401) {
                    nav("/login");
                }
            }),
    });

    const userEditMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "users", async (msg, queryKey) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey });
            }),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to update user: ${msg}`, {
                    variant: "error",
                });
                if (code === 401) {
                    nav("/login");
                }
            }),
    });

    return {
        queries: { usersQuery, teamsQuery, pokemonQuery },
        mutations: { userDeleteMutation, userEditMutation },
    };
};

const useUserQueriesAndMutations = (user: { uid: number; tid?: number }) => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    const nav = useNavigate();
    // const uid = useStore((state) => state.uid);

    const teamsQuery = useQuery({
        queryKey: "teams",
        queryFn: () => getTeams(user.uid),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to get teams: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
        staleTime: 10000,
        refetchInterval: 300000000,
    });

    const teamPokemonQuery = useQuery({
        queryKey: "teamPokemon",
        queryFn: () => getTeamInfoById(user.tid!),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to get team pokemon: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
        enabled: false,
        staleTime: 5000,
    });

    const teamAddPokemonMutation = useMutation({
        mutationFn: addTeamPokemon,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "teamPokemon", async (msg, queryKey) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey });
            }),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to add pokemon to team: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
    });

    const teamUpdatePokemonMutation = useMutation({
        mutationFn: updateTeamPokemon,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "teamPokemon", async (msg, queryKey) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey });
            }),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to update pokemon in team: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
    });

    const teamDeletePokemonMutation = useMutation({
        mutationFn: deleteTeamPokemon,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "teamPokemon", async (msg, queryKey) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey });
            }),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to delete pokemon from team: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
    });

    const teamDeleteManyPokemonMutation = useMutation({
        mutationFn: deleteManyTeamPokemon,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "teamPokemon", async (msg, queryKey) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey });
            }),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to delete pokemon from team: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
    });

    const teamUpdateMutation = useMutation({
        mutationFn: updateTeamById,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "teams", async (msg, queryKey) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey });
            }),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to update team: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
    });

    const teamCreateMutation = useMutation({
        mutationFn: createTeam,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "teams", async (msg, queryKey) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey });
            }),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to add team: ${msg}`, {
                    variant: "error",
                });

                if (code === 401) {
                    nav("/login");
                }
            }),
    });

    const teamDeleteMutation = useMutation({
        mutationFn: deleteTeamById,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "teams", async (msg) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey: ["teams"] });
            }),
        onError: (err) =>
            doOnError(err, (msg, code) => {
                enqueueSnackbar(`Failed to delete team: ${msg}`, {
                    variant: "error",
                });
                if (code === 401) {
                    nav("/login");
                }
            }),
    });

    return {
        queries: { teamsQuery, teamPokemonQuery },
        mutations: {
            teamUpdateMutation,
            teamCreateMutation,
            teamDeleteMutation,

            teamAddPokemonMutation,
            teamUpdatePokemonMutation,
            teamDeletePokemonMutation,
            teamDeleteManyPokemonMutation,
        },
    };
};

export { useUserQueriesAndMutations, useAdminQueriesAndMutations };
