<?php

/*
* Teams route
* Handles all requests made to admin/teams
*/
require_once __DIR__.'/../../services/TeamService.php';
require_once __DIR__.'/../../services/PokemonService.php';
require_once __DIR__.'/../../utils.php';

$TeamService = new TeamService;
$PokemonService = new PokemonService;

$teamRoutes = [
    'GET' => ['all' => teamGetAll(...), 'all-pokemon' => teamGetAllPokemon(...)],
    'DELETE' => ['delete' => teamDelete(...)],
];

/**
 * Get all pokemon in all the teams
 *
 * @return A list of all pokemon in all the teams or an error message
 */
function teamGetAllPokemon()
{
    global $PokemonService;
    $res = $PokemonService->GetAll();
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

/**
 * Get all teams in the database
 *
 * @return A list of all teams in the database or an error message
 */
function teamGetAll()
{
    global $TeamService;
    $res = $TeamService->GetAll();
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

/**
 * Delete a team from the database by id
 *
 * @param  $data  Contains the id of the team to delete
 * @return A success message or an error message
 */
function teamDelete($data)
{
    global $TeamService;
    $res = $TeamService->Delete($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

/**
 * Handles all requests made to admin/teams
 *
 * @param  $verb  The HTTP verb used
 * @param  $uri  The uri of the request
 */
function teamsHandler($verb, $uri)
{
    global $teamRoutes;
    routeHandler($verb, $uri, $teamRoutes);
}
