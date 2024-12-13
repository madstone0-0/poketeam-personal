<?php

function formatPokemonName($name)
{
    $formatted = str_replace('-', ' ', $name);
    $formatted = ucwords($formatted);

    return $formatted;
}

function trimArray($array)
{
    return array_map(function ($item) {
        return trim($item);
    }, $array);
}

function send($data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($data);
}

function sendData($data, int $statusCode = 200): void
{
    send(['data' => $data], $statusCode);
}

function sendError($data, int $statusCode = 400): void
{
    send(['err' => $data], $statusCode);
}

function mysql_datetime($timestamp)
{
    return date('Y-m-d H:i:s', $timestamp);
}

function mysql_datetime_from_mystring($date)
{
    return date('Y-m-d H:i:s', strtotime($date));
}

function any($array, $func)
{
    foreach ($array as $item) {
        if (! $func($item)) {
            return true;
        }
    }

    return false;
}

function slice($array, $start = 1, $end = null)
{
    if ($end == null) {
        return array_slice($array, $start, count($array));
    } else {
        return array_slice($array, $start, $end);
    }
}

function handleNoBody($uri, $func)
{
    try {
        // Check if there is a body
        $rawInput = file_get_contents('php://input');
        $data = $rawInput ? json_decode($rawInput, associative: true) : null;

        // Determine if $func is a callable function or a method
        $reflection = is_array($func)
            ? new ReflectionMethod($func[0], $func[1]) // For class methods
            : new ReflectionFunction($func);          // For standalone functions or closures

        // Get the number of required parameters
        $requiredParams = $reflection->getNumberOfRequiredParameters();

        // URI takes precedence over body
        if (isset($uri[2]) && $uri[2] !== null) {
            $data = $uri[2];
            $func($data);
        } elseif ($data !== null) {
            // Check if the required parameters are met
            $func($data);
        } elseif ($requiredParams === 0) {
            // No body and no required parameters
            $func();
        } else {
            throw new InvalidArgumentException('Insufficient arguments for the function.');
        }
    } catch (ReflectionException $e) {
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['error' => 'Internal Server Error']);
    } catch (InvalidArgumentException $e) {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['error' => 'Bad Request']);
    }
}

function isOk($status)
{
    return $status >= 200 && $status < 300;
}

function parseURI($rootFile = 'index.php')
{
    $uri = parse_url($_SERVER['PHP_SELF'], PHP_URL_PATH);
    $uri = explode('/', $uri);

    // Remove elements before and including index.php
    $uri = slice($uri, array_search($rootFile, $uri) + 1);

    // Remove empty elements
    $uri = array_filter($uri, function ($value) {
        return $value !== '';
    });

    return $uri;
}

function handleBody($func)
{
    $data = json_decode(file_get_contents('php://input'), associative: true);
    if ($data === null) {
        sendError('Invalid JSON', 400);

        return;
    }
    $func($data);
}

function routeHandler($verb, $uri, $routes)
{
    try {
        $subroute = $uri[1];

        if (! isset($routes[$verb][$subroute])) {
            sendError('Route not found', 404);
            exit();
        }

        $func = $routes[$verb][$subroute];

        if (! $func) {
            sendError('Route not found', 404);
            exit();
        }

        match ($verb) {
            'GET', 'DELETE' => handleNoBody($uri, $func),
            'POST', 'PUT' => handleBody($func),
        };

    } catch (Exception $e) {
        throw $e;
    }
}

const emailRegex = '/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.]{2,6}$/';
const passwordRegexes = [
    [
        'msg' => 'Must be at least 8 characters long',
        'regex' => '/.{8,}/',
    ],
    [
        'msg' => 'Must have at least one uppercase letter',
        'regex' => '/[A-Z]/',
    ],
    [
        'msg' => 'Must include at least 3 digits',
        'regex' => "/\d{3,}/",
    ],
    [
        'msg' => 'Must contain at least one special character',
        'regex' => "~[!@#$%^&*()\-_=+\|{};:/?.>]~",
    ],
];

function validateEmail($email)
{

    return preg_match(emailRegex, $email);
}

function validatePassword($password)
{
    $problems = [];
    $result = true;

    array_map(function ($item) use ($password, &$problems, &$result) {
        $msg = $item['msg'];
        $regex = $item['regex'];
        $res = preg_match($regex, $password);
        if (! $res) {
            $problems[] = $msg;
        }
        if ($result) {
            $result = $res;
        }
    }, passwordRegexes);

    return ['result' => $result, 'problems' => $problems];
}

function handleEmail($email)
{
    if (! validateEmail($email)) {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['err' => 'Invalid email']);

        return false;
    }

    return true;
}

function handlePasswordProblems($password)
{
    $res = validatePassword($password);
    if (! $res['result']) {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['err' => 'Invalid password', 'problems' => $res['problems']]);

        return false;
    }

    return true;
}
