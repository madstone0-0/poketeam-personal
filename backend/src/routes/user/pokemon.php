<?php

/*
* Pokemon route
* Handles all requests made to user/pokemon
*/
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

/**
 * Get all moves for a pokemon
 *
 * @param  $id  The id of the pokemon
 * @return A list of all moves for the pokemon or an error message
 */
function pokemonMoves($id)
{
    global $MovesService;
    $res = $MovesService->FetchById($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }
    sendData($res['data'], $res['status']);
}

/**
 * Get all stats for a pokemon
 *
 * @param  $id  The id of the pokemon
 * @return A list of all stats for the pokemon or an error message
 */
function pokemonStats($id)
{
    global $StatsService;
    $res = $StatsService->FetchById($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Information about the pokemon service
 */
function pokemonInfo()
{
    sendData('Pokemon service', 200);
}

/**
 * Get a pokemon by id
 *
 * @param  $id  The id of the pokemon
 * @return The pokemon or an error message
 */
function pokemonGetById($id)
{
    global $PokemonService;
    $res = $PokemonService->GetById($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Search for a pokemon by name
 *
 * @param  $data  Contains a substring of the pokemon name
 * @return An array of pokemon matching the search or an error message
 */
function pokemonSearch($data)
{
    global $PokemonService;
    $res = $PokemonService->FetchByName($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Handles all requests made to user/pokemon
 *
 * @param  $verb  The HTTP verb used
 * @param  $uri  The uri of the request
 */
function pokemonHandler($verb, $subroute)
{
    global $pokemonRoutes;

    return routeHandler($verb, $subroute, $pokemonRoutes);
}
