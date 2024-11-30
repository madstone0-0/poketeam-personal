<?php

session_start();

require_once __DIR__.'/../utils.php';

$userRoutes = [
    'GET' => ['ping' => pong(...)],
];

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
    global $userRoutes;

    return routeHandler($verb, $subroute, $userRoutes);
}
