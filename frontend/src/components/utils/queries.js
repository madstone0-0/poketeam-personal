import { useQueryClient, useQuery, useMutation } from "react-query";
import React from "react";
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
import useStore from "../stores";

export const doOnError = (err, feebackFn) => {
    let err_msg = "";
    if (err instanceof AxiosError) {
        err_msg = err.response.data.msg;
        if (err_msg === undefined) err_msg = err.message;
    } else if (err instanceof Error) {
        err_msg = err.message;
    } else {
        err_msg = "Unknown error";
    }

    feebackFn(err_msg);
};

export const doOnSuccessMsg = async (res, queryKey, callback = successCallback) => {
    const msg = res.msg;
    await callback(msg, queryKey);
};

const useAdminQueriesAndMutations = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const usersQuery = useQuery({
        queryKey: "users",
        queryFn: () => getAllUsers(),
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get users: ${msg}`, {
                    variant: "error",
                }),
            ),
        staleTime: 10000,
        refetchInterval: 30000,
    });

    const teamsQuery = useQuery({
        queryKey: "allTeams",
        queryFn: () => getAllTeams(),
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get teams: ${msg}`, {
                    variant: "error",
                }),
            ),
        staleTime: 10000,
        refetchInterval: 300000,
    });

    const pokemonQuery = useQuery({
        queryKey: "allPokemon",
        queryFn: () => getAllPokemon(),
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get teams: ${msg}`, {
                    variant: "error",
                }),
            ),
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
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to delete user: ${msg}`, {
                    variant: "error",
                });
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
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to update user: ${msg}`, {
                    variant: "error",
                });
            }),
    });

    return {
        queries: { usersQuery, teamsQuery, pokemonQuery },
        mutations: { userDeleteMutation, userEditMutation },
    };
};

const useUserQueriesAndMutations = (user) => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    // const uid = useStore((state) => state.uid);

    const teamsQuery = useQuery({
        queryKey: "teams",
        queryFn: () => getTeams(user.uid),
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get teams: ${msg}`, {
                    variant: "error",
                }),
            ),
        staleTime: 10000,
        refetchInterval: 300000000,
    });

    const teamPokemonQuery = useQuery({
        queryKey: "teamPokemon",
        queryFn: () => getTeamInfoById(user.tid),
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get team pokemon: ${msg}`, {
                    variant: "error",
                }),
            ),
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
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to add pokemon to team: ${msg}`, {
                    variant: "error",
                });
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
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to update pokemon in team: ${msg}`, {
                    variant: "error",
                });
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
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to delete pokemon from team: ${msg}`, {
                    variant: "error",
                });
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
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to delete pokemon from team: ${msg}`, {
                    variant: "error",
                });
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
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to update team: ${msg}`, {
                    variant: "error",
                });
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
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to add team: ${msg}`, {
                    variant: "error",
                });
            }),
    });

    const teamDeleteMutation = useMutation({
        mutationFn: deleteTeamById,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "teams", async (msg, queryKey) => {
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey: ["teams"] });
            }),
        onError: (err) =>
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to delete team: ${msg}`, {
                    variant: "error",
                });
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
