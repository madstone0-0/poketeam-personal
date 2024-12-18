<?php

/*
* Team route
* Handles all requests made to user/team
*/
require_once __DIR__.'/../../services/TeamService.php';
require_once __DIR__.'/../../utils.php';

$TeamService = new TeamService;

$teamRoutes = [
    'GET' => ['id' => teamGetById(...), 'all' => teamGetByUID(...), 'info' => teamInfo(...), 'pokemon-id' => teamGetPokemon(...)],
    'POST' => ['create' => teamCreate(...), 'pokemon-add' => teamAddPokemon(...)],
    'PUT' => ['update' => teamUpdate(...), 'pokemon-update' => teamUpdatePokemon(...)],
    'DELETE' => [
        'delete' => teamDelete(...),
        'pokemon-delete' => teamDeletePokemon(...),
        'pokemon-delete-many' => teamDeletePokemonMany(...),
    ],
];

/**
 * Delete multiple pokemon from a team
 *
 * @param  $data  Contains the team id and the pokemon ids to delete
 * @return A success message or an error message
 */
function teamDeletePokemonMany($data)
{
    global $TeamService;
    $res = $TeamService->DeleteManyTeamPokemon($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }
    sendData($res['data'], $res['status']);
}

/**
 * Adds pokemon to a team
 *
 * @param  $data  Contains the team id and the pokemon id(s) to add
 * @return A success message or an error message
 */
function teamAddPokemon($data)
{
    global $TeamService;
    $res = $TeamService->AddTeamPokemon($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }
    sendData($res['data'], $res['status']);
}

/**
 * Delete a pokemon from a team
 *
 * @param  $data  Contains the team id and the pokemon id to delete
 * @return A success message or an error message
 */
function teamDeletePokemon($data)
{
    global $TeamService;
    $res = $TeamService->DeleteTeamPokemon($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }
    sendData($res['data'], $res['status']);
}

/**
 * Get team information by team id
 *
 * @param  $id  Team id
 * @return Team information or an error message
 */
function teamGetById($id)
{
    global $TeamService;
    $res = $TeamService->GetById($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Information about the team service
 */
function teamInfo()
{
    sendData('Team service', 200);
}

/**
 * Get all teams by a user id
 *
 * @param  $uid  The user id
 * @return All teams by the user or an error message
 */
function teamGetByUID($uid)
{
    global $TeamService;
    $res = $TeamService->GetByUID($uid);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Update the pokemon in a team
 *
 * @param  $data  Contains the team id and the pokemon id and information to update
 * @return A success message or an error message
 */
function teamUpdatePokemon($data)
{
    global $TeamService;
    $res = $TeamService->UpdateTeamPokemon($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Create a new team in the database for a user
 *
 * @param  $data  Contains the user id and the team information
 * @return A success message or an error message
 */
function teamCreate($data)
{
    global $TeamService;
    $res = $TeamService->Create($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Update team information
 *
 * @param  $data  Contains the team id and the information to update
 * @return A success message or an error message
 */
function teamUpdate($data)
{
    global $TeamService;
    $res = $TeamService->Update($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Delete a team from the database by id
 *
 * @param  $id  Team id
 * @return A success message or an error message
 */
function teamDelete($id)
{
    global $TeamService;
    $res = $TeamService->Delete($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Get all pokemon in a team
 *
 * @param  $tid  Team id
 * @return A list of all pokemon in the team or an error message
 */
function teamGetPokemon($tid)
{
    global $TeamService;
    $res = $TeamService->GetTeamPokemon($tid);
    error_log(json_encode($res));
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

/**
 * Handles all requests made to user/team
 *
 * @param  $verb  The HTTP verb used
 * @param  $uri  The uri of the request
 */
function teamHandler($verb, $uri)
{
    global $teamRoutes;
    routeHandler($verb, $uri, $teamRoutes);
}
