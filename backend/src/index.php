<?php

require_once __DIR__.'/./utils.php';
require_once __DIR__.'/./middleware.php';

/*ini_set('display_errors', 1);*/
/*error_reporting(E_ALL);*/

$out = <<<'_GAN'
    They have taken the bridge and the second hall.
    We have barred the gates but cannot hold them for long.
    The ground shakes, drums... drums in the deep. We cannot get out.
    A shadow lurks in the dark. We can not get out.
    They are coming.
    _GAN;

define('HEADERS', [
    'Content-Type: application/json; charset=UTF-8',
    'Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE',
    'Access-Control-Max-Age: 3600',
    'Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
]);

define('RULES', [
    'POST /auth/signup' => ['email' => ['required' => true], 'password' => ['required' => true], 'username' => ['required' => true],
        'fname' => ['required' => true], 'lname' => ['required' => true],
    ],
    'POST /auth/login' => ['email' => ['required' => true], 'password' => ['required' => true]],
]);

$handler = new MiddlewareHandler;
if ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1') {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Credentials: true');
    foreach (HEADERS as $header) {
        header($header);
    }
    $handler->add(new JsonMiddleware)->add(new ValidationMiddleware(RULES));

} else {
    $corsOptions = [
        'allowedOrigins' => [
            'http://localhost:5173',
            'http://169.239.251.102:3341',
        ],
        'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowedHeaders' => ['Content-Type', 'Authorization', 'X-Requested-With'],
        'allowCredentials' => true,
        'maxAge' => 3600,
    ];

    $handler->add(new CorsMiddleware($corsOptions))->add(new JsonMiddleware)->add(new ValidationMiddleware(RULES));

}

if (! $handler->handle()) {
    if (! headers_sent()) {
        header('HTTP/1.1 400 Bad Request');
    }
    exit(1);
}

// Get the URI and split it into its components
$uri = parseURI();

// Get the HTTP verb
$verb = $_SERVER['REQUEST_METHOD'];

// If the URI is empty, return a 404
if (! isset($uri[0])) {
    sendError('Empty route', 404);
    exit();
}

try {
    // Match the first element of the URI to the appropriate route
    switch ($uri[0]) {
        case 'info':
            sendData(['msg' => 'Welcome to the Poketeam API']);
            break;
        case 'health':
            sendData(['status' => $out]);
            break;
        case 'auth':
            require_once __DIR__.'/./routes/auth.php';
            authHandler($verb, $uri);
            break;
        default:
            sendError('Route not found', 404);
            exit();
            break;
    }
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
