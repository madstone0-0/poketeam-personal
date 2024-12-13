<?php

require_once __DIR__.'/../db/db.php';
require_once __DIR__.'/../utils.php';
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class MovesService
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
            $moves = $res['data']['moves'];
            $moves = array_map(function ($move) {
                $mid = explode('/', $move['move']['url'])[6];

                return [
                    'id' => intval($mid),
                    'name' => $move['move']['name'],
                ];
            }, $moves);

            return [
                'status' => 200,
                'data' => $moves,
            ];

        } catch (Exception $e) {
            error_log('Failed to fetch move data: '.$e->getMessage());

            return [
                'status' => 500,
                'data' => 'Failed to fetch move data',
            ];
        }
    }

    public function GetById($pid, $tid)
    {
        global $db;
        $stmt = $db->prepare('select * from moves where pid = ? and tid = ?');
        $stmt->bindParam(1, $pid);
        $stmt->bindParam(2, $tid);

        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to fetch moves',
            ];
        }
        $result = $stmt->fetchAll();

        if (! $result) {
            return [
                'status' => 404,
                'data' => 'Moves not found',
            ];
        }

        return [
            'status' => 200,
            'data' => $result,
        ];
    }

    private function getNextFreeSlot($pid, $tid)
    {
        global $db;
        $stmt = $db->prepare('select max(slot) from moves where pid = ? and tid = ?');
        $stmt->bindParam(1, $pid);
        $stmt->bindParam(2, $tid);
        if (! $stmt->execute()) {
            throw new Exception('Failed to fetch free slots');
        }
        $slot = $stmt->fetchColumn();
        error_log('slot: '.json_encode($slot));

        return $slot + 1;
    }

    public function Add($data)
    {
        $tid = $data['tid'];
        $pid = $data['pid'];
        $mid = $data['mid'];

        $nextSlot = $this->getNextFreeSlot($pid, $tid);
        if ($nextSlot > 4) {
            return [
                'status' => 400,
                'data' => 'Too many moves',
            ];
        }
        global $db;
        $stmt = $db->prepare('insert into moves (pid, tid, mid, slot) values (?, ?, ?, ?)');
        $stmt->bindParam(1, $pid);
        $stmt->bindParam(2, $tid);
        $stmt->bindParam(3, $mid);
        $stmt->bindParam(4, $nextSlot);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to add move',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Move added successfully'],
        ];
    }

    public function AssignRandomMoves($data)
    {
        $tid = $data['tid'];
        $pid = $data['pid'];

        $movesRes = $this->FetchById($pid);
        if (! isOk($movesRes['status'])) {
            return $movesRes;
        }
        $moves = $movesRes['data'];

        global $db;
        // $db->beginTransaction();
        try {
            for ($i = 0; $i < 4; $i++) {
                $move = $moves[array_rand($moves)];
                $addRes = $this->Add(['tid' => $tid, 'pid' => $pid, 'mid' => $move['id']]);
                if (! isOk($addRes['status'])) {
                    throw new Exception('Failed to assign moves');
                }
            }

            // $db->commit();

            return [
                'status' => 200,
                'data' => ['msg' => 'Starter moves assigned successfully'],
            ];
        } catch (Exception $e) {
            // $db->rollBack();

            return [
                'status' => 500,
                'data' => $e->getMessage(),
            ];
        }

    }
}
