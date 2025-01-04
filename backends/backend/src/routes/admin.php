<?php

/*
* Admin route
* Handles all requests made to /admin
*/
session_start();

require_once __DIR__.'/../utils.php';
require_once __DIR__.'/admin/users.php';
require_once __DIR__.'/admin/teams.php';
require_once __DIR__.'/user/pokemon.php';

/**
 * Ping the server
 *
 * @return A pong message or an error message
 */
function pong()
{
    if (! checkAdminAuth()) {
        return;
    }
    sendData('pong', 200);
}

/**
 * Handles all requests made to /admin
 *
 * @param  $verb  The HTTP verb used
 * @param  $subroute  The subroute of the request
 * @return A success message or an error message
 */
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
        default:
            sendError('Route not found', 404);
            break;

    }
}
