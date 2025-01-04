<?php

/*
* User route
* Handles all requests made to user/team
*/
session_start();

require_once __DIR__.'/../utils.php';
require_once __DIR__.'/user/team.php';
require_once __DIR__.'/user/pokemon.php';

/**
 * Ping the server
 *
 * @return A pong message or an error message
 */
function pong()
{
    if (! checkUserAuth()) {
        return;
    }
    sendData('pong', 200);
}

/**
 * Handles all requests made to /user
 *
 * @param  $verb  The HTTP verb used
 * @param  $subroute  The subroute of the request
 * @return A success message or an error message
 */
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
            if (! checkUserAuth()) {
                return;
            }
            teamHandler($verb, $subroute);
            break;
        case 'pokemon':
            if (! checkUserAuth()) {
                return;
            }
            pokemonHandler($verb, $subroute);
            break;
        default:
            sendError('Route not found', 404);
            break;

    }
}
