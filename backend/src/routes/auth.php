<?php

session_start();
require_once __DIR__.'/../utils.php';
require_once __DIR__.'/../services/UserService.php';

$UserService = new UserService;

$authRoutes = [
    'POST' => [
        'signup' => signUp(...), 'login' => login(...),
    ],
];

function signUp($data)
{
    if (! handleEmpty($data) || ! handleEmail($data['email']) || ! handlePasswordProblems($data['password'])) {
        return;
    }

    global $UserService;
    $res = $UserService->SignUp($data);
    if (! isOk($res['status'])) {
        sendError($res['data'], $res['status']);

        return;
    }
    sendData($res['data'], $res['status']);
}

function login($data)
{
    global $UserService;
    $res = $UserService->Login($data['email'], $data['password']);
    if (! isOk($res['status'])) {
        sendError($res['data'], $res['status']);

        return;
    }

    $_SESSION['user'] = $res['data'];
    sendData($res['data'], $res['status']);
}

function authHandler($verb, $uri)
{
    global $authRoutes;

    return routeHandler($verb, $uri, $authRoutes);
}
