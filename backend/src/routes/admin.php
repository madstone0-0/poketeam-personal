<?php

session_start();

require_once __DIR__.'/../utils.php';
require_once __DIR__.'/admin/users.php';
require_once __DIR__.'/admin/teams.php';
require_once __DIR__.'/user/pokemon.php';

function pong()
{
    if (! checkAdminAuth()) {
        return;
    }
    sendData('pong', 200);
}

function adminHandler($verb, $subroute)
{
    switch ($subroute[0]) {
        case 'ping':
            if ($verb !== 'GET') {
                sendError('Method not allowed', 405);

                return;
            }
            pong();
            break;
        case 'users':
            if (! checkAdminAuth()) {
                return;
            }
            usersHandler($verb, $subroute);
            break;
        case 'teams':
            if (! checkAdminAuth()) {
                return;
            }
            teamsHandler($verb, $subroute);
            break;
            // case 'pokemon':
            //     if (! checkAdminAuth()) {
            //         return;
            //     }
            //     pokemonHandler($verb, $subroute);
            //     break;
        default:
            sendError('Route not found', 404);
            break;

    }
}
