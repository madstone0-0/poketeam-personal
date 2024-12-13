<?php

require_once __DIR__.'/../../vendor/autoload.php';
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpClient\ThrottlingHttpClient;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\RateLimiter\Storage\InMemoryStorage;
use Symfony\Contracts\HttpClient\HttpClientInterface;

require_once __DIR__.'/../db/db.php';
require_once __DIR__.'/../utils.php';
require_once __DIR__.'/../constants.php';

const CACHE_TIMESTAMP_KEY = 'timestamp';
const CACHE_SUCCESS_KEY = 'success';

class PokemonService
{
    private HttpClientInterface $client;

    public function buildCache(): void
    {
        global $db;
        $cacheFile = __DIR__.'/cache_timestamp.json';

        $cacheData = file_exists($cacheFile) ? @json_decode(file_get_contents($cacheFile), true) : [];
        if (! is_array($cacheData)) {
            $cacheData = [];
        }
        $lastCached = $cacheData['timestamp'] ?? null;
        $lastCacheSuccessful = $cacheData['success'] ?? null;

        if ($lastCached && $lastCacheSuccessful && (time() - $lastCached < AGE_TO_UPDATE)) {
            return;
        }

        try {
            $initialRes = $this->client->request('GET', POKEAPI.'/pokemon?limit=1');
            $totalPokemonCount = $initialRes->toArray()['count'];

            $res = $this->client->request('GET', POKEAPI."/pokemon?limit={$totalPokemonCount}");

            if ($res->getStatusCode() !== 200) {
                throw new Exception('Failed to fetch pokemon data');
            }

            $pids = [];
            $db->beginTransaction();
            foreach ($res->toArray()['results'] as $pokemon) {
                $pid = explode('/', $pokemon['url'])[6];
                $pids[] = $pid;
            }
            $pokemonDataBatch = $this->fetchPokemonByIdInParallel($pids, false);

            $this->cachePokemonBatch($pokemonDataBatch);
            $db->commit();

            $tempFile = $cacheFile.'.tmp';
            file_put_contents($tempFile, json_encode(['timestamp' => time(), 'success' => true]));
            rename($tempFile, $cacheFile);
        } catch (Exception $e) {
            $db->rollBack();
            error_log('Cache build failed: '.$e->getMessage());
            $tempFile = $cacheFile.'.tmp';
            file_put_contents($tempFile, json_encode(['timestamp' => time(), 'success' => false]));
            rename($tempFile, $cacheFile);
        }
    }

    public function __construct()
    {
        $factory = new RateLimiterFactory([
            'id' => 'http_example_limiter',
            'policy' => 'token_bucket',
            'limit' => 100,
            'rate' => ['interval' => '5 seconds', 'amount' => 50],
        ], new InMemoryStorage);
        $limiter = $factory->create();
        $this->client = HttpClient::create();
        $this->client = new ThrottlingHttpClient($this->client, $limiter);
    }

    /**
     * @return bool
     */
    private function pokemonExistsInCache($pid)
    {
        global $db;

        $query = 'SELECT * FROM pokemon_cache WHERE pid = :pid';
        $stmt = $db->prepare($query);
        $stmt->execute(['pid' => $pid]);
        $result = $stmt->fetchAll();

        return $result != null && count($result) > 0;
    }

    /**
     * @return bool
     */
    private function insertIntoCache($pokemonData)
    {
        global $db;
        $query = <<<'SQL'
        insert into pokemon_cache (pid, name, type1, type2, sprite_url) values (:pid, :name, :type1, :type2, :sprite_url)
SQL;
        $name = formatPokemonName($pokemonData['name']);
        $stmt = $db->prepare($query);
        $stmt->bindParam(':pid', $pokemonData['pid']);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':type1', $pokemonData['type1']);
        $stmt->bindParam(':type2', $pokemonData['type2']);
        $stmt->bindParam(':sprite_url', $pokemonData['sprite_url']);
        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    private function cachePokemonBatch(array $pokemonDataBatch)
    {
        global $db;
        $query = <<<'SQL'
    INSERT INTO pokemon_cache (pid, name, type1, type2, sprite_url) 
    VALUES (:pid, :name, :type1, :type2, :sprite_url)
    ON DUPLICATE KEY UPDATE 
        name = :update_name, 
        type1 = :update_type1, 
        type2 = :update_type2, 
        sprite_url = :update_sprite_url;
SQL;

        $stmt = $db->prepare($query);

        foreach ($pokemonDataBatch as $pokemonData) {
            $stmt->bindValue(':pid', $pokemonData['pid']);
            $stmt->bindValue(':name', $pokemonData['name']);
            $stmt->bindValue(':type1', $pokemonData['type1']);
            $stmt->bindValue(':type2', $pokemonData['type2']);
            $stmt->bindValue(':sprite_url', $pokemonData['sprite_url']);
            $stmt->bindValue(':update_name', $pokemonData['name']);
            $stmt->bindValue(':update_type1', $pokemonData['type1']);
            $stmt->bindValue(':update_type2', $pokemonData['type2']);
            $stmt->bindValue(':update_sprite_url', $pokemonData['sprite_url']);

            if (! $stmt->execute()) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return bool|<missing>
     */
    private function cachePokemon($pokemonData)
    {
        global $db;
        $query = <<<'SQL'
insert
	into
	pokemon_cache (pid,
	name,
	type1,
	type2,
	sprite_url)
values (:pid,
:name,
:type1,
:type2,
:sprite_url) on
duplicate key
update
	pokemon_cache
set
	name = :name,
	type1 = :type1,
	type2 = :type2,
	sprite_url = :sprite_url
where
	pid = :pid

SQL;
        $stmt = $db->prepare($query);
        $stmt->bindParam(':name', formatPokemonName($pokemonData['name']));
        $stmt->bindParam(':type1', $pokemonData['type1']);
        $stmt->bindParam(':type2', $pokemonData['type2']);
        $stmt->bindParam(':sprite_url', $pokemonData['sprite_url']);
        $stmt->bindParam(':pid', $pokemonData['pid']);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    private function getCachedPokemon($pid)
    {
        global $db;
        $query = 'SELECT * FROM pokemon_cache WHERE pid = :pid';
        $stmt = $db->prepare($query);
        $stmt->execute(['pid' => $pid]);
        $result = $stmt->fetch();

        return $result;
    }

    /**
     * @return bool
     */
    private function isCacheFresh($pokemonData)
    {
        if (! isset($pokemonData['last_updated'])) {
            return false;
        }

        try {
            $lastUpdated = new DateTime($pokemonData['last_updated']);
            $currentTime = new DateTime;

            $interval = $currentTime->diff($lastUpdated);

            // More precise age calculation
            $ageInSeconds =
                $interval->days * 24 * 60 * 60 +
                $interval->h * 60 * 60 +
                $interval->i * 60 +
                $interval->s;

            return $ageInSeconds < AGE_TO_UPDATE;
        } catch (Exception $e) {
            error_log('Timestamp parsing error: '.$e->getMessage());

            return false;
        }
    }

    private function fetchPokemonByIdInParallel($pids, $cache = true, $batchSize = 50)
    {
        $batches = array_chunk($pids, $batchSize);
        $pokemonDataBatch = [];
        $i = 0;
        foreach ($batches as $batch) {
            error_log(sprintf('[CACHE(%d/%d)] Fetching batch of %d pokemon', $i, count($batches), count($batch)));
            $responses = [];
            foreach ($batch as $pid) {
                $cachedPokemon = $this->getCachedPokemon($pid);
                if ($cachedPokemon && $this->isCacheFresh($cachedPokemon)) {
                    error_log(sprintf('[CACHE (%d/%d)] Pokemon data %d is fresh', $i, count($batches), $pid));
                    $pokemonDataBatch[] = $cachedPokemon;
                } else {
                    error_log(sprintf("[CACHE (%d/%d)] Fetching pokemon data $pid from API", $i, count($batches)));
                    $responses[$pid] = $this->client->request('GET', POKEAPI."/pokemon/$pid");
                }
            }

            foreach ($this->client->stream($responses) as $res => $chunk) {
                if ($chunk->isLast()) {
                    $content = $res->toArray();
                    error_log(sprintf("[CACHE (%d/%d)] Fetched pokemon data {$content['id']} from API", $i, count($batches)));
                    $pokemonData = [
                        'pid' => $content['id'],
                        'name' => formatPokemonName($content['name']),
                        'type1' => $content['types'][0]['type']['name'],
                        'type2' => $content['types'][1]['type']['name'] ?? null,
                        'sprite_url' => $content['sprites']['front_default'],
                    ];

                    if ($cache) {
                        $this->cachePokemon($pokemonData);
                    }

                    $pokemonDataBatch[] = $pokemonData;
                }
            }
            $i++;
            usleep(5000);
        }

        return $pokemonDataBatch;

    }

    /**
     * @return <missing>|array*/
    private function fetchPokemonById($pid, $cache = true)
    {
        $cachedPokemon = $this->getCachedPokemon($pid);

        if ($cachedPokemon && $this->isCacheFresh($cachedPokemon)) {
            error_log('Pokemon data is fresh');

            return $cachedPokemon;
        }

        error_log('Fetching pokemon data from API');
        $res = $this->client->request('GET', POKEAPI."/pokemon/$pid");
        if ($res->getStatusCode() !== 200) {
            switch ($res->getStatusCode()) {
                case 404:
                    throw new Exception('Pokemon not found');
                default:
                    throw new Exception('Failed to fetch pokemon data');
            }
        }
        $content = $res->toArray();

        $pokemonData = [
            'pid' => $content['id'],
            'name' => formatPokemonName($content['name']),
            'type1' => $content['types'][0]['type']['name'],
            'type2' => $content['types'][1]['type']['name'] ?? null,
            'sprite_url' => $content['sprites']['front_default'],
        ];

        if ($cache) {
            $this->cachePokemon($pokemonData);
        }

        return $pokemonData;
    }

    public function GetFromAPIById($pid)
    {
        try {
            $res = $this->client->request('GET', POKEAPI."/pokemon/$pid");

            if ($res->getStatusCode() !== 200) {
                throw new Exception('Failed to fetch pokemon data');
            }

            return [
                'status' => 200,
                'data' => $res->toArray(),
            ];

        } catch (Exception $e) {

            return [
                'status' => 500,
                'data' => $e->getMessage(),
            ];
        }
    }

    /**
     * @return array<string,mixed>
     */
    public function GetById($pid)
    {
        try {
            $res = $this->fetchPokemonById($pid);

            return [
                'status' => 200,
                'data' => $res,
            ];

        } catch (Exception $e) {

            return [
                'status' => 500,
                'data' => $e->getMessage(),
            ];
        }
    }

    /**
     * @return array<string,mixed>
     */
    public function FetchByName($data)
    {
        $name = $data['name'];

        try {
            // $this->buildCache(); // Move to background job
            error_log('Building cache in background');
            $script = dirname(__DIR__).'/buildCache.php';
            $logPath = dirname(__DIR__).'/cache_build.log';
            $phpBinary = '/usr/bin/php';
            $cmd = "$phpBinary $script > $logPath 2>&1 &";
            $res = shell_exec($cmd);
            error_log($res);
        } catch (Exception $e) {
            error_log($e->getMessage());

            return [
                'status' => 500,
                'data' => 'Failed to fetch pokemon data',
            ];
        }

        global $db;

        $query = 'SELECT * FROM pokemon_cache WHERE name LIKE :name';
        $stmt = $db->prepare($query);

        if (! $stmt->execute(
            [
                'name' => "%$name%",
            ]
        )) {
            return [
                'status' => 500,
                'data' => 'Failed to fetch pokemon data',
            ];
        }

        $result = $stmt->fetchAll();

        return [
            'status' => 200,
            'data' => $result,
        ];
    }
}
