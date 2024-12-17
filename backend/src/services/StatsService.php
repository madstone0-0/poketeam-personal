<?php

require_once __DIR__.'/../constants.php';
require_once __DIR__.'/../db/db.php';
require_once __DIR__.'/../utils.php';
require_once __DIR__.'/./PokemonService.php';
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class StatsService
{
    private HttpClientInterface $client;

    private PokemonService $pokemonService;

    public function __construct()
    {
        $this->client = HttpClient::create();
        $this->pokemonService = new PokemonService;
    }

    public function FetchById($pid)
    {
        try {

            $res = $this->pokemonService->GetFromAPIById($pid);
            if (! isOk($res['status'])) {
                throw new Exception('Failed to fetch pokemon data');
            }
            $stats = $res['data']['stats'];
            $stats = array_map(function ($stat) {
                return [
                    $stat['stat']['name'] => $stat['base_stat'],
                ];
            }, $stats);
            $stats = array_merge(...$stats);

            return [
                'status' => 200,
                'data' => $stats,
            ];

        } catch (Exception $e) {
            error_log('Failed to fetch stat data: '.$e->getMessage());

            return [
                'status' => 500,
                'data' => 'Failed to fetch stat data',
            ];
        }
    }

    public function GetById($pid, $tid)
    {
        global $db;
        $stmt = $db->prepare('select * from stats where pid = ? and tid = ?');
        $stmt->bindParam(1, $pid);
        $stmt->bindParam(2, $tid);

        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to fetch stats',
            ];
        }
        $result = $stmt->fetch();

        if (! $result) {
            return [
                'status' => 404,
                'data' => 'Stats not found',
            ];
        }

        return [
            'status' => 200,
            'data' => $result,
        ];
    }

    public function UpdateByPokemon($data)
    {
        $pid = $data['pid'];
        $tid = $data['tid'];
        $stats = $data['stats'];

        $query = <<<'SQL'
            update stats set
                hp = :hp,
                attack = :attack,
                defense = :defense,
                spattack = :spattack,
                spdefense = :spdefense,
                speed = :speed
            where pid = :pid and tid = :tid
        SQL;

        global $db;
        $stmt = $db->prepare($query);
        foreach ($stats as $stat) {
            $stmt->bindParam(':'.$stat['name'], $stat['value']);
        }

        $stmt->bindParam(':pid', $pid);
        $stmt->bindParam(':tid', $tid);

        if (! $stmt->execute()) {
            error_log('Failed to update stats');

            return [
                'status' => 500,
                'data' => 'Failed to update stats',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Stats updated successfully'],
        ];

    }

    public function Add($data)
    {
        global $db;
        $tid = $data['tid'];
        $pid = $data['pid'];
        $hp = $data['hp'];
        $atk = $data['attack'];
        $def = $data['defense'];
        $spa = $data['special-attack'];
        $spd = $data['special-defense'];
        $spe = $data['speed'];

        $stmt = $db->prepare('insert into stats (tid, pid, hp, attack, defense, spattack, spdefense, speed) values (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bindParam(1, $tid);
        $stmt->bindParam(2, $pid);
        $stmt->bindParam(3, $hp);
        $stmt->bindParam(4, $atk);
        $stmt->bindParam(5, $def);
        $stmt->bindParam(6, $spa);
        $stmt->bindParam(7, $spd);
        $stmt->bindParam(8, $spe);

        if (! $stmt->execute()) {
            error_log('Failed to add stats');

            return [
                'status' => 500,
                'data' => 'Failed to add stats',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Stats added successfully'],
        ];
    }
}
