<?php

define('RULES', [
    /**
     * Auth
     */
    'POST /auth/signup' => ['email' => ['required' => true], 'password' => ['required' => true], 'username' => ['required' => true],
        'fname' => ['required' => true], 'lname' => ['required' => true],
    ],
    'POST /auth/login' => ['email' => ['required' => true], 'password' => ['required' => true]],
    'DELETE /auth/delete' => ['id' => ['required' => true]],

    /**
     * User
     */
    // Team
    'GET /user/team/id', ['id' => ['required' => true]],
    'GET /user/team/all', ['id' => ['required' => true]],
    'POST /user/team/create' => ['id' => ['required' => true], 'name' => ['required' => true]],
    'PUT /user/team/update' => ['id' => ['required' => true], 'name' => ['required' => true]],
    'DELETE /user/team/delete' => ['id' => ['required' => true]],
    // Team Pokemon
    'GET /user/team/pokemon-id', ['id' => ['required' => true]],
    'PUT /user/team/pokemon-update' => ['tid' => ['required' => true], 'pokemon' => ['required' => true]],
    'POST /user/team/pokemon-add' => ['tid' => ['required' => true], 'pokemon' => ['required' => true]],
    'DELETE /user/team/pokemon-delete' => ['tid' => ['required' => true], 'pid' => ['required' => true]],
    'DELETE /user/team/pokemon-delete-many' => ['tid' => ['required' => true], 'pids' => ['required' => true]],

    //Pokemon
    'GET /user/pokemon/id', ['id' => ['required' => true]],
    'POST /user/pokemon/search' => ['name' => ['required' => true]],
    'GET /user/pokemon/stats', ['id' => ['required' => true]],
    'GET /user/pokemon/moves', ['id' => ['required' => true]],
]);
