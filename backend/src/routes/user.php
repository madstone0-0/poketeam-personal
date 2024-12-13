<?php

session_start();

require_once __DIR__.'/../utils.php';
require_once __DIR__.'/user/team.php';
require_once __DIR__.'/user/pokemon.php';

function checkAuth()
{
    if (! isset($_SESSION['user'])) {
        sendError('Unauthorized', 401);

        return false;
    }

    return true;
}

function pong()
{
    if (! checkAuth()) {
        return;
    }
    sendData('pong', 200);
}

function userHandler($verb, $subroute)
{
    switch ($subroute[0]) {
        case 'ping':
            if ($verb !== 'GET') {
                sendError('Method not allowed', 405);

                return;
            }
            pong();
            break;
        case 'team':
            teamHandler($verb, $subroute);
            break;
        case 'pokemon':
            pokemonHandler($verb, $subroute);
            break;
        default:
            sendError('Route not found', 404);
            break;

    }
}
