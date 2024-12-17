<?php

session_start();
require_once __DIR__.'/../../services/UserService.php';
require_once __DIR__.'/../../utils.php';

$UserService = new UserService;

$userRoutes = [
    'GET' => ['all' => userGetAll(...)],
    'DELETE' => ['delete' => userDelete(...)],
];

function userGetAll()
{
    global $UserService;
    $res = $UserService->GetAll();
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

function userDelete($data)
{
    global $UserService;
    $res = $UserService->Delete($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

function usersHandler($verb, $uri)
{
    global $userRoutes;
    routeHandler($verb, $uri, $userRoutes);
}
