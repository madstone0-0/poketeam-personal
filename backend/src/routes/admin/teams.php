<?php

require_once __DIR__.'/../../services/TeamService.php';
require_once __DIR__.'/../../services/PokemonService.php';
require_once __DIR__.'/../../utils.php';

$TeamService = new TeamService;
$PokemonService = new PokemonService;

$teamRoutes = [
    'GET' => ['all' => teamGetAll(...), 'all-pokemon' => teamGetAllPokemon(...)],
    'DELETE' => ['delete' => teamDelete(...)],
];

function teamGetAllPokemon()
{
    global $PokemonService;
    $res = $PokemonService->GetAll();
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

function teamGetAll()
{
    global $TeamService;
    $res = $TeamService->GetAll();
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

function teamDelete($data)
{
    global $TeamService;
    $res = $TeamService->Delete($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

function teamsHandler($verb, $uri)
{
    global $teamRoutes;
    routeHandler($verb, $uri, $teamRoutes);
}
