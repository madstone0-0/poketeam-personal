<?php

session_start();
require_once __DIR__.'/../utils.php';
require_once __DIR__.'/../services/UserService.php';

$UserService = new UserService;

$authRoutes = [
    'GET' => ['logout' => logout(...)],
    'POST' => [
        'signup' => signUp(...), 'login' => login(...),
    ],
    'PUT' => ['update' => updateAccount(...)],
    'DELETE' => ['delete' => deleteAccount(...)],
];

function logout()
{
    session_start();
    session_destroy();
    session_unset();
    session_abort();
    sendData('Logged out', 200);
}

function updateAccount($data)
{
    global $UserService;
    $res = $UserService->Update($data);
    if (! isOk($res['status'])) {
        sendError($res['data'], $res['status']);

        return;
    }
    sendData($res['data'], $res['status']);
}

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

function deleteAccount($id)
{
    if (! checkUserAuth()) {
        return;
    }

    global $UserService;
    $res = $UserService->Delete($id);
    if (! isOk($res['status'])) {
        sendError($res['data'], $res['status']);

        return;
    }
    sendData($res['data'], $res['status']);
}

function authHandler($verb, $uri)
{
    global $authRoutes;

    return routeHandler($verb, $uri, $authRoutes);
}
