<?php

define('RULES', [
    /**
     * Auth
     */
    'POST /auth/signup' => ['email' => ['required' => true], 'password' => ['required' => true], 'username' => ['required' => true],
        'fname' => ['required' => true], 'lname' => ['required' => true],
    ],
    'POST /auth/login' => ['email' => ['required' => true], 'password' => ['required' => true]],
    'PUT /auth/update' => ['email' => ['required' => true], 'username' => ['required' => true],
        'fname' => ['required' => true], 'lname' => ['required' => true],
        // 'is_admin' => ['required' => true],
    ],
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

    // Moves
    'POST /user/moves/update' => ['tid' => ['required' => true], 'pid' => ['required' => true], 'moves' => ['required' => true]],

    //Pokemon
    'GET /user/pokemon/id', ['id' => ['required' => true]],
    'POST /user/pokemon/search' => ['name' => ['required' => true]],
    'GET /user/pokemon/stats', ['id' => ['required' => true]],
    'GET /user/pokemon/moves', ['id' => ['required' => true]],

    /**
     * Admin
     */
    // Users
    'GET /admin/users/all', [],
    'DELETE /admin/users/delete' => ['id' => ['required' => true]],
    'PUT /admin/users/update' => ['id' => ['required' => true]],

    // Teams
    'GET /admin/teams/all', [],
    'GET /admin/teams/all-pokemon', [],
    'DELETE /admin/teams/delete' => ['id' => ['required' => true]],

    // Pokemon
    'GET /admin/pokemon/all', [],
    'DELETE /admin/pokemon/delete' => ['id' => ['required' => true]],

]);
