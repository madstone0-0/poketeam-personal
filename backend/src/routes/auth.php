<?php

/*
* Authentication route
* Handles all requests made to /auth
*/

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

/**
 * Logs out the user
 */
function logout()
{
    session_start();
    session_destroy();
    session_unset();
    session_abort();
    sendData('Logged out', 200);
}

/**
 * Update user account
 *
 * @param  $data  The data to update the account with
 * @return A success message or an error message
 */
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

/**
 * Sign up a new user
 *
 * @param  $data  The data to sign up with
 * @return A success message or an error message
 */
function signUp($data)
{
    global $UserService;
    $res = $UserService->SignUp($data);
    if (! isOk($res['status'])) {
        sendError($res['data'], $res['status']);

        return;
    }
    sendData($res['data'], $res['status']);
}

/**
 * Log in a user
 *
 * @param  $data  Login data
 * @return A success message or an error message
 */
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

/**
 * Delete a user account
 *
 * @param  $id  The id of the account to delete
 * @return A success message or an error message
 */
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

/**
 * Handles all requests made to /auth
 *
 * @param  $verb  The HTTP verb used
 * @param  $uri  The uri of the request
 */
function authHandler($verb, $uri)
{
    global $authRoutes;

    return routeHandler($verb, $uri, $authRoutes);
}
