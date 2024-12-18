<?php

/*
* Users route
* Handles all requests made to admin/users
*/

session_start();
require_once __DIR__.'/../../services/UserService.php';
require_once __DIR__.'/../../utils.php';

$UserService = new UserService;

$userRoutes = [
    'GET' => ['all' => userGetAll(...)],
    'DELETE' => ['delete' => userDelete(...)],
];

/**
 * Get all users in the database
 *
 * @return All users in the database or an error message
 */
function userGetAll()
{
    global $UserService;
    $res = $UserService->GetAll();
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

/**
 * Delete a user from the database by id
 *
 * @param  $data  Contains the id of the user to delete
 * @return A success message or an error message
 */
function userDelete($data)
{
    global $UserService;
    $res = $UserService->Delete($data);
    if (! isOk($res['status'])) {
        return sendError($res['data'], $res['status']);
    }

    sendData($res['data'], $res['status']);
}

/**
 * Handles all requests made to admin/users
 *
 * @param  $verb  The HTTP verb used
 * @param  $uri  The uri of the request
 */
function usersHandler($verb, $uri)
{
    global $userRoutes;
    routeHandler($verb, $uri, $userRoutes);
}
