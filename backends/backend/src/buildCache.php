<?php

require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/./services/PokemonService.php';

try {
    echo "Building cache...\n";
    $pokemonService = new PokemonService;
    $pokemonService->buildCache();

    file_put_contents(__DIR__.'/cache_build.log',
        date('Y-m-d H:i:s')." - Cache successfully built\n",
        FILE_APPEND
    );
} catch (Exception $e) {
    echo 'Cache build failed: '.$e->getMessage()."\n";
    file_put_contents(__DIR__.'/cache_build_error.log',
        date('Y-m-d H:i:s').' - '.$e->getMessage()."\n",
        FILE_APPEND
    );
}
