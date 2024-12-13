<?php

require_once __DIR__.'/../db/db.php';
require_once __DIR__.'/../utils.php';
require_once __DIR__.'/../services/StatsService.php';
require_once __DIR__.'/../services/MovesService.php';

class TeamService
{
    private function doesTeamExist($id)
    {
        global $db;
        $stmt = $db->prepare('select * from team where tid = ?');
        $stmt->bindParam(1, $id);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return count($result) > 0;
    }

    private function doesPokeomExistInTeam($tid, $pid)
    {
        global $db;
        $stmt = $db->prepare('select * from team_pokemon where tid = ? and pid = ?');
        $stmt->bindParam(1, $tid);
        $stmt->bindParam(2, $pid);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return count($result) > 0;
    }

    private function doesStatsExist($pid, $tid)
    {
        global $db;
        $stmt = $db->prepare('select * from stats where tid = ? and pid = ?');
        $stmt->bindParam(1, $tid);
        $stmt->bindParam(2, $pid);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return count($result) > 0;
    }

    private function doesMovesExist($pid, $tid)
    {
        global $db;
        $stmt = $db->prepare('select * from moves where tid = ? and pid = ?');
        $stmt->bindParam(1, $tid);
        $stmt->bindParam(2, $pid);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return count($result) > 0;
    }

    public function GetById($id)
    {
        if (! $this->doesTeamExist($id)) {
            return [
                'status' => 404,
                'data' => 'Team not found',
            ];
        }

        global $db;
        $stmt = $db->prepare('select * from team where tid = ?');
        $stmt->bindParam(1, $id);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to fetch team',
            ];
        }

        $result = $stmt->fetch();

        return [
            'status' => 200,
            'data' => $result,
        ];
    }

    public function GetByUID($uid)
    {
        global $db;
        $stmt = $db->prepare('select * from team where uid = ?');
        $stmt->bindParam(1, $uid);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to fetch user teams',
            ];
        }
        $teams = $stmt->fetchAll();

        return [
            'status' => 200,
            'data' => $teams,
        ];
    }

    public function Create($data)
    {
        $uid = $data['id'];
        $name = $data['name'];

        global $db;
        $stmt = $db->prepare('insert into team (uid, team_name) values (?, ?)');
        $stmt->bindParam(1, $uid);
        $stmt->bindParam(2, $name);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to create team',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Team created successfully', 'id' => $db->lastInsertId()],
        ];
    }

    public function Update($data)
    {
        $tid = $data['id'];
        $name = $data['name'];

        if (! $this->doesTeamExist($tid)) {
            return [
                'status' => 404,
                'data' => 'Team not found',
            ];
        }

        global $db;
        $stmt = $db->prepare('update team set team_name = ? where tid = ?');
        $stmt->bindParam(1, $name);
        $stmt->bindParam(2, $tid);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to update team',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Team updated successfully', 'id' => $tid],
        ];
    }

    public function Delete($id)
    {
        if (! $this->doesTeamExist($id)) {
            return [
                'status' => 404,
                'data' => 'Team not found',
            ];
        }

        global $db;
        $stmt = $db->prepare('delete from team where tid = ?');
        $stmt->bindParam(1, $id);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to delete team',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Team deleted successfully'],
        ];
    }

    public function DeleteManyTeamPokemon($data)
    {
        $tid = $data['tid'];
        $pids = $data['pids'];

        if (! $this->doesTeamExist($tid)) {
            return [
                'status' => 404,
                'data' => 'Team does not exist',
            ];
        }

        if (count($pids) === 0) {
            return [
                'status' => 400,
                'data' => 'No pokemon to delete',
            ];
        }

        if (any(function ($pid) use ($tid) {
            error_log($pid);

            return ! $this->doesPokeomExistInTeam($tid, $pid);
        }, $pids)) {
            return [
                'status' => 404,
                'data' => 'Pokemon not found in team',
            ];
        }

        global $db;

        $stmt = $db->prepare('delete from team_pokemon where tid = ? and pid in ('.implode(',', $pids).')');
        $stmt->bindParam(1, $tid);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to delete team pokemon',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Team pokemon deleted successfully'],
        ];
    }

    public function DeleteTeamPokemon($data)
    {
        $tid = $data['tid'];
        $pid = $data['pid'];

        if (! $this->doesTeamExist($tid)) {
            return [
                'status' => 404,
                'data' => 'Team does not exist',
            ];
        }

        if (! $this->doesPokeomExistInTeam($tid, $pid)) {
            return [
                'status' => 404,
                'data' => 'Pokemon not found in team',
            ];
        }

        global $db;
        $stmt = $db->prepare('delete from team_pokemon where tid = ? and pid = ?');
        $stmt->bindParam(1, $tid);
        $stmt->bindParam(2, $pid);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to delete team pokemon',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Team pokemon deleted successfully'],
        ];
    }

    public function DeleteAllTeamPokemon($data)
    {
        $tid = $data['tid'];
        if (! $this->doesTeamExist($tid)) {
            return [
                'status' => 404,
                'data' => 'Team not found',
            ];
        }

        global $db;
        $stmt = $db->prepare('delete from team_pokemon where tid = ?');
        $stmt->bindParam(1, $tid);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to delete team pokemon',
            ];
        }

        return [
            'status' => 200,
            'data' => ['msg' => 'Team pokemon deleted successfully'],
        ];
    }

    public function UpdateTeamPokemon($data)
    {
        $tid = $data['tid'];
        $pokemon = $data['pokemon'];
        if (! $this->doesTeamExist($tid)) {
            return [
                'status' => 404,
                'data' => 'Team not found',
            ];
        }

        global $db;
        $StatsService = new StatsService;
        $db->beginTransaction();

        $this->DeleteAllTeamPokemon($data);
        try {
            foreach ($pokemon as $p) {
                $pid = $p['pid'];
                $nickname = $p['nickname'];
                $level = $p['level'];
                $is_shiny = $p['is_shiny'];
                $stmt = $db->prepare('insert into team_pokemon (tid, pid, nickname, level, is_shiny) values (?, ?, ?, ?, ?)');
                $stmt->bindParam(1, $tid);
                $stmt->bindParam(2, $pid);
                $stmt->bindParam(3, $nickname);
                $stmt->bindParam(4, $level);
                $stmt->bindParam(5, $is_shiny);
                error_log('Inserting team pokemon');
                if (! $stmt->execute()) {
                    error_log('Failed to update team pokemon');
                    throw new Exception('Failed to update team pokemon');
                }
                if ($this->doesStatsExist($pid, $tid)) {
                    error_log('Stats already exist');

                    continue;
                } else {
                    $statsRes = $StatsService->FetchById($pid);
                    if (! isOk($statsRes['status'])) {
                        error_log('Failed to fetch stats');

                        throw new Exception('Failed to fetch stats');
                    }
                    $data = array_merge($statsRes['data'], ['tid' => $tid, 'pid' => $pid]);
                    $StatsService->Add($data);
                }
            }

            $db->commit();

            return [
                'status' => 200,
                'data' => ['msg' => 'Team pokemon updated successfully'],
            ];
        } catch (Exception $e) {
            $db->rollBack();

            error_log($e->getMessage());

            return [
                'status' => 500,
                'data' => 'Failed to update team pokemon',
            ];
        }
    }

    public function GetTeamPokemonCount($tid)
    {
        if (! $this->doesTeamExist($tid)) {
            return [
                'status' => 404,
                'data' => 'Team not found',
            ];
        }

        global $db;
        $stmt = $db->prepare('select count(*) as count from team_pokemon where tid = ?');
        $stmt->bindParam(1, $tid);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to fetch team pokemon count',
            ];
        }

        $result = $stmt->fetch();

        return [
            'status' => 200,
            'data' => $result,
        ];
    }

    public function AddTeamPokemon($data)
    {
        $tid = $data['tid'];
        $pokemon = $data['pokemon'];
        if (! $this->doesTeamExist($tid)) {
            return [
                'status' => 404,
                'data' => 'Team not found',
            ];
        }

        $countRes = $this->GetTeamPokemonCount($tid);
        if (! isOk($countRes['status'])) {
            return [
                'status' => 500,
                'data' => 'Failed to fetch team pokemon count',
            ];
        }

        $count = $countRes['data']['count'];
        if ($count + count($pokemon) > 6) {
            return [
                'status' => 400,
                'data' => 'Each team can have a maximum of 6 pokemon',
            ];
        }

        global $db;
        try {
            $db->beginTransaction();
            $StatsService = new StatsService;
            $MovesService = new MovesService;

            $stmt = $db->prepare('insert into team_pokemon (tid, pid, nickname, level, is_shiny) values (?, ?, ?, ?, ?)');
            foreach ($pokemon as $p) {
                $pid = $p['pid'];
                $nickname = $p['nickname'];
                $level = $p['level'];
                $is_shiny = $p['is_shiny'];
                $stmt->bindParam(1, $tid);
                $stmt->bindParam(2, $pid);
                $stmt->bindParam(3, $nickname);
                $stmt->bindParam(4, $level);
                $stmt->bindParam(5, $is_shiny);
                error_log('Inserting team pokemon');
                if (! $stmt->execute()) {
                    error_log('Failed to add team pokemon');
                    throw new Exception('Failed to add team pokemon');
                }

                if ($this->doesStatsExist($pid, $tid)) {
                    error_log('Stats already exist');

                    continue;
                } else {
                    $statsRes = $StatsService->FetchById($pid);
                    if (! isOk($statsRes['status'])) {
                        error_log('Failed to fetch stats');

                        throw new Exception('Failed to fetch stats');
                    }
                    $data = array_merge($statsRes['data'], ['tid' => $tid, 'pid' => $pid]);
                    $StatsService->Add($data);
                }

                if ($this->doesMovesExist($pid, $tid)) {
                    error_log('Moves already exist');

                    continue;
                } else {
                    $movesRes = $MovesService->AssignRandomMoves(['tid' => $tid, 'pid' => $pid]);
                    if (! isOk($movesRes['status'])) {
                        error_log('Failed to assign moves');

                        throw new Exception('Failed to assign starter moves');
                    }
                }
            }
            $db->commit();

            return [
                'status' => 200,
                'data' => ['msg' => 'Team pokemon added successfully'],
            ];

        } catch (Exception $e) {
            $db->rollBack();
            error_log($e->getMessage());

            return [
                'status' => 500,
                'data' => 'Failed to add team pokemon',
            ];
        }
    }

    public function GetTeamPokemon($tid)
    {
        if (! $this->doesTeamExist($tid)) {
            return [
                'status' => 404,
                'data' => 'Team not found',
            ];
        }

        global $db;
        $query = <<<'SQL'
select
	tm.pid,
	tm.tid,
	tm.is_shiny,
	tm.`level`,
	tm.nickname,
	pc.type1,
	pc.type2 ,
	pc.name,
	pc.sprite_url,
	s.hp,
	s.attack,
	s.defense,
	s.spattack,
	s.spdefense,
	s.speed,
	m.mid,
	m.slot 
from
	team_pokemon tm
inner join pokemon_cache pc on
	pc.pid = tm.pid
inner join stats s on
	s.pid = tm.pid
inner join moves m on
	m.pid = tm.pid
where
	tm.tid = ?
-- GROUP by tm.pid;
SQL;
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $tid);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to fetch team pokemon',
            ];
        }

        $pokemonData = $stmt->fetchAll();
        $pokemon = [];
        foreach ($pokemonData as $poke) {
            $pid = $poke['pid'];
            if (! isset($pokemon[$pid])) {
                $pokemon[$pid] = [
                    'pid' => $pid,
                    'name' => $poke['name'],
                    'nickname' => $poke['nickname'],
                    'sprite_url' => $poke['sprite_url'],
                    'type1' => $poke['type1'],
                    'type2' => $poke['type2'],
                    'stats' => [
                        'hp' => $poke['hp'],
                        'attack' => $poke['attack'],
                        'defense' => $poke['defense'],
                        'spattack' => $poke['spattack'],
                        'spdefense' => $poke['spdefense'],
                        'speed' => $poke['speed'],
                    ],
                    'moves' => [
                        ['mid' => $poke['mid'], 'slot' => $poke['slot']],
                    ],
                ];
            } else {
                $pokemon[$pid]['moves'][] = ['mid' => $poke['mid'], 'slot' => $poke['slot']];
            }
        }
        $pokemon = array_values($pokemon);

        return [
            'status' => 200,
            'data' => [
                'team' => [
                    'team_id' => $tid,
                    'team_name' => $this->GetById($tid)['data']['team_name'],
                ],
                'pokemon' => $pokemon,
            ],
        ];
    }
}
