<?php

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

function teamDeletePokemonMany($data)
{
    global $TeamService;
    $res = $TeamService->DeleteManyTeamPokemon($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }
    sendData($res['data'], $res['status']);
}

function teamAddPokemon($data)
{
    global $TeamService;
    $res = $TeamService->AddTeamPokemon($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }
    sendData($res['data'], $res['status']);
}

function teamDeletePokemon($data)
{
    global $TeamService;
    $res = $TeamService->DeleteTeamPokemon($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }
    sendData($res['data'], $res['status']);
}

function teamGetById($id)
{
    global $TeamService;
    $res = $TeamService->GetById($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

function teamInfo()
{
    sendData('Team service', 200);
}

function teamGetByUID($uid)
{
    global $TeamService;
    $res = $TeamService->GetByUID($uid);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

function teamUpdatePokemon($data)
{
    global $TeamService;
    $res = $TeamService->UpdateTeamPokemon($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

function teamCreate($data)
{
    global $TeamService;
    $res = $TeamService->Create($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

function teamUpdate($data)
{
    global $TeamService;
    $res = $TeamService->Update($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

function teamDelete($id)
{
    global $TeamService;
    $res = $TeamService->Delete($id);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);

    }

    sendData($res['data'], $res['status']);
}

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

function teamHandler($verb, $uri)
{
    global $teamRoutes;
    routeHandler($verb, $uri, $teamRoutes);
}
