<?php

require_once __DIR__.'/../../services/MovesService.php';
require_once __DIR__.'/../../services/StatsService.php';
require_once __DIR__.'/../../services/PokemonService.php';
require_once __DIR__.'/../../utils.php';

$PokemonService = new PokemonService;
$StatsService = new StatsService;
$MovesService = new MovesService;

$pokemonRoutes = [
    'GET' => ['id' => pokemonGetById(...), 'info' => pokemonInfo(...), 'stats' => pokemonStats(...), 'moves' => pokemonMoves(...)],
    'POST' => ['search' => pokemonSearch(...)],
];

function pokemonMoves($id)
{
    global $MovesService;
    $res = $MovesService->FetchById($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }
    sendData($res['data'], $res['status']);
}

function pokemonStats($id)
{
    global $StatsService;
    $res = $StatsService->FetchById($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

function pokemonInfo()
{
    sendData('Pokemon service', 200);
}

function pokemonGetById($id)
{
    global $PokemonService;
    $res = $PokemonService->GetById($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

function pokemonSearch($data)
{
    global $PokemonService;
    $res = $PokemonService->FetchByName($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

function pokemonHandler($verb, $subroute)
{
    global $pokemonRoutes;

    return routeHandler($verb, $subroute, $pokemonRoutes);
}
