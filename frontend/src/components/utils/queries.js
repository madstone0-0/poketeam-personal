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
} from "./api";

export const doOnError = (err, feebackFn) => {
    console.log({ err });
    let err_msg = "";
    if (err instanceof AxiosError) {
        err_msg = err.response.data.msg;
        if (err_msg === undefined) err_msg = err.message;
    } else if (err instanceof Error) {
        err_msg = err.message;
    } else {
        err_msg = "Unknown error";
    }
    console.log({ err_msg });

    feebackFn(err_msg);
};

export const doOnSuccessMsg = async (res, queryKey, callback = successCallback) => {
    const msg = res.msg;
    await callback(msg, queryKey);
};

const useUserQueriesAndMutations = (user) => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const teamsQuery = useQuery({
        queryKey: "teams",
        queryFn: () => getTeams(user.uid),
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get teams: ${msg}`, {
                    variant: "error",
                }),
            ),
        staleTime: 5000,
        refetchInterval: 30000,
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
                console.log({ msg });
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

    const teamDeletePokemonMutation = useMutation({
        mutationFn: deleteTeamPokemon,
        onSuccess: async (res) =>
            await doOnSuccessMsg(res, "teamPokemon", async (msg, queryKey) => {
                console.log({ msg });
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
                console.log({ msg });
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
                console.log({ msg });
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
                console.log({ msg });
                enqueueSnackbar(msg, { variant: "success" });
                await queryClient.invalidateQueries({ queryKey });
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
            teamDeletePokemonMutation,
            teamDeleteManyPokemonMutation,
        },
    };
};

export { useUserQueriesAndMutations };
