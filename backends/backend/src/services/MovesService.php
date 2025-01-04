<?php

require_once __DIR__.'/../db/db.php';
require_once __DIR__.'/../utils.php';

/**
 * Moves Service Class
 * Handle all operations related to moves, including fetching, adding, deleting, and updating moves
 */
class MovesService
{
    private PokemonService $pokemonService;

    public function __construct()
    {
        $this->pokemonService = new PokemonService;
    }

    /**
     * Get the number of moves assigned to a Pokemon in a team
     *
     * @param  $pid  Pokemon id
     * @param  $tid  Team id
     * @return int Number of moves assigned to the Pokemon in the team
     */
    public function getMoveCount(int $pid, int $tid): int
    {
        global $db;
        $query = <<<'SQL'
select
	count(*)
from
	moves
where
	pid = ?
	and tid = ?;
SQL;
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $pid);
        $stmt->bindParam(2, $tid);
        $stmt->execute();

        return $stmt->fetchColumn();
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

    /**
     * @param  mixed  $pid
     * @return array<string,mixed>
     */
    public function FetchAllByPid($pid)
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

    /**
     * @param  mixed  $pid
     * @param  mixed  $tid
     * @return array<string,mixed>
     */
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

    /**
     * @param  mixed  $data
     * @return array<string,mixed>
     */
    public function Add($data)
    {
        $tid = $data['tid'];
        $pid = $data['pid'];
        $mid = $data['mid'];

        $moveCount = $this->getMoveCount($pid, $tid);
        if ($moveCount >= 4) {
            return [
                'status' => 400,
                'data' => 'Too many moves',
            ];
        }

        global $db;
        $stmt = $db->prepare('insert into moves (pid, tid, mid) values (?, ?, ?)');
        $stmt->bindParam(1, $pid);
        $stmt->bindParam(2, $tid);
        $stmt->bindParam(3, $mid);
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

    /**
     * @param  mixed  $data
     * @return array<string,mixed>
     */
    public function DeleteAllMovesByPid($data)
    {
        $pid = $data['pid'];
        $tid = $data['tid'];

        global $db;
        $stmt = $db->prepare('delete from moves where pid = ? and tid = ?');
        $stmt->bindParam(1, $pid);
        $stmt->bindParam(2, $tid);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to delete moves',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Moves deleted successfully'],
        ];
    }

    /**
     * @param  mixed  $data
     * @return array<string,mixed>
     */
    public function UpdateByPid($data)
    {
        $pid = $data['pid'];
        $tid = $data['tid'];
        $moves = $data['moves'];
        $startedTransactionHere = true;

        error_log('Moves: '.json_encode($moves));
        global $db;
        try {
            if (! $db->inTransaction()) {
                $db->beginTransaction();
            } else {
                $startedTransactionHere = false;
            }
            $deleteRes = $this->DeleteAllMovesByPid(['pid' => $pid, 'tid' => $tid]);
            if (! isOk($deleteRes['status'])) {
                throw new Exception('Failed to delete moves');
            }
            $stmt = $db->prepare('insert into moves (pid, tid, mid) values (?, ?, ?)');
            foreach ($moves as $move) {
                $stmt->bindParam(1, $pid);
                $stmt->bindParam(2, $tid);
                $stmt->bindParam(3, $move['mid']);
                if (! $stmt->execute()) {
                    throw new Exception('Failed to update moves');
                }
            }
            if ($startedTransactionHere) {
                $db->commit();
            }

            return [
                'status' => 200,
                'data' => ['msg' => 'Moves updated successfully'],
            ];
        } catch (Exception $e) {
            error_log('Failed to update moves: '.$e->getTraceAsString());
            if ($startedTransactionHere) {
                $db->rollBack();
            }

            return [
                'status' => 500,
                'data' => $e->getMessage(),
            ];
        }

    }

    /**
     * @return []@param array<int,mixed> $moves
     */
    private function selectUniqueRandomMoves(array $moves, int $count): array
    {
        // Shuffle the moves array to randomize selection
        shuffle($moves);

        // Use a set to track unique move IDs
        $uniqueMoveIds = [];
        $selectedMoves = [];

        foreach ($moves as $move) {
            // If this move's ID hasn't been seen before
            if (! in_array($move['id'], $uniqueMoveIds)) {
                $uniqueMoveIds[] = $move['id'];
                $selectedMoves[] = $move;

                // Stop when we've found the desired number of unique moves
                if (count($selectedMoves) >= $count) {
                    break;
                }
            }
        }

        // If not enough unique moves, return all available moves
        return $selectedMoves;
    }

    /**
     * @return array<string,mixed>* @param mixed $data
     */
    public function AssignRandomMoves($data)
    {
        $tid = $data['tid'];
        $pid = $data['pid'];

        $movesRes = $this->FetchById($pid);
        if (! isOk($movesRes['status'])) {
            return $movesRes;
        }
        $moves = $movesRes['data'];

        $selectedMoves = $this->selectUniqueRandomMoves($moves, 4);
        try {
            $assignedMoves = [];

            foreach ($selectedMoves as $move) {
                $addRes = $this->Add([
                    'tid' => $tid,
                    'pid' => $pid,
                    'mid' => $move['id'],
                ]);

                if (! isOk($addRes['status'])) {
                    throw new Exception("Failed to assign move: {$move['id']}");
                }

                $assignedMoves[] = $move['id'];
            }

            return [
                'status' => 200,
                'data' => [
                    'msg' => 'Starter moves assigned successfully',
                    'moves' => $assignedMoves,
                ],
            ];
        } catch (Exception $e) {

            return [
                'status' => 500,
                'data' => $e->getMessage(),
            ];
        }

    }
}
