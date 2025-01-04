<?php

require_once __DIR__.'/../db/db.php';
require_once __DIR__.'/../utils.php';
require_once __DIR__.'/../services/StatsService.php';
require_once __DIR__.'/../services/UserService.php';
require_once __DIR__.'/../services/MovesService.php';

class TeamService
{
    /**
     * @param  mixed  $id
     */
    private function doesTeamExist($id): bool
    {
        global $db;
        $stmt = $db->prepare('select * from team where tid = ?');
        $stmt->bindParam(1, $id);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return count($result) > 0;
    }

    /**
     * @param  mixed  $tid
     */
    private function updatedLastUpdated($tid): void
    {
        global $db;
        $stmt = $db->prepare('update team set updated_at = now() where tid = ?');
        $stmt->bindParam(1, $tid);
        $stmt->execute();
    }

    /**
     * @param  mixed  $tid
     * @param  mixed  $pid
     */
    private function doesPokeomExistInTeam($tid, $pid): bool
    {
        global $db;
        $stmt = $db->prepare('select * from team_pokemon where tid = ? and pid = ?');
        $stmt->bindParam(1, $tid);
        $stmt->bindParam(2, $pid);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return count($result) > 0;
    }

    /**
     * @param  mixed  $pid
     * @param  mixed  $tid
     */
    private function doesStatsExist($pid, $tid): bool
    {
        global $db;
        $stmt = $db->prepare('select * from stats where tid = ? and pid = ?');
        $stmt->bindParam(1, $tid);
        $stmt->bindParam(2, $pid);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return count($result) > 0;
    }

    /**
     * @param  mixed  $pid
     * @param  mixed  $tid
     */
    private function doesMovesExist($pid, $tid): bool
    {
        global $db;
        $stmt = $db->prepare('select * from moves where tid = ? and pid = ?');
        $stmt->bindParam(1, $tid);
        $stmt->bindParam(2, $pid);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return count($result) > 0;
    }

    public function GetAll()
    {
        global $db;
        $query = <<<'SQL'
        select
        	*
        from
        	team t
        inner join user u on
        	u.uid = t.uid;
        SQL;
        $stmt = $db->prepare($query);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to fetch teams',
            ];
        }

        $result = $stmt->fetchAll();
        $data = [];
        foreach ($result as $team) {
            $data[] = [
                'tid' => $team['tid'],
                'team_name' => $team['team_name'],
                'uid' => $team['uid'],
                'created_at' => $team['created_at'],
                'updated_at' => $team['updated_at'],
                'user' => [
                    'username' => $team['username'],
                    'email' => $team['email'],
                    'fname' => $team['fname'],
                    'lname' => $team['lname'],
                ],
            ];
        }

        return [
            'status' => 200,
            'data' => $data,
        ];
    }

    /**
     * @param  mixed  $id
     */
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

    /**
     * @param  mixed  $uid
     */
    public function GetByUID($uid)
    {
        $UserService = new UserService;
        if (! $UserService->doesUserExistId($uid)) {
            return [
                'status' => 404,
                'data' => 'User not found',
            ];
        }

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

    /**
     * @param  mixed  $data
     */
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

    /**
     * @param  mixed  $data
     */
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

    /**
     * @param  mixed  $id
     */
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

    /**
     * @param  mixed  $data
     */
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

    /**
     * @param  mixed  $data
     */
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

        $this->updatedLastUpdated($tid);

        return [
            'status' => 200,
            'data' => ['msg' => 'Team pokemon deleted successfully'],
        ];
    }

    /**
     * @param  mixed  $data
     */
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

    /**
     * @param  mixed  $data
     */
    public function UpdateTeamPokemon($data)
    {
        $tid = $data['tid'];
        $pokemon = $data['pokemon'];
        $pid = $pokemon['pid'];
        $stats = $pokemon['stats'];
        $moves = $pokemon['moves'];

        if (! $this->doesTeamExist($tid)) {
            return [
                'status' => 404,
                'data' => 'Team not found',
            ];
        }

        if (! $this->doesPokeomExistInTeam($tid, $pid)) {
            return [
                'status' => 404,
                'data' => 'Pokemon not found in team',
            ];
        }

        global $db;
        $StatsService = new StatsService;
        $MovesService = new MovesService;
        $db->beginTransaction();

        try {
            $query = <<<'SQL'
            update team_pokemon set
            is_shiny = :is_shiny,
            level = :level,
            nickname = :nickname
            where pid = :pid and tid = :tid
            SQL;

            $stmt = $db->prepare($query);
            $stmt->bindParam(':is_shiny', $pokemon['is_shiny']);
            $stmt->bindParam(':level', $pokemon['level']);
            $stmt->bindParam(':nickname', $pokemon['nickname']);
            $stmt->bindParam(':pid', $pid);
            $stmt->bindParam(':tid', $tid);

            if (! $stmt->execute()) {
                error_log(json_encode($stmt->errorInfo()));
                throw new Exception('Failed to update team pokemon');
            }
            $statsRes = $StatsService->UpdateByPokemon([
                'pid' => $pid,
                'tid' => $tid,
                'stats' => $stats,
            ]);

            if (! isOk($statsRes['status'])) {
                throw new Exception('Failed to update team pokemon stats');
            }

            $movesRes = $MovesService->UpdateByPid([
                'pid' => $pid,
                'tid' => $tid,
                'moves' => $moves,
            ]);

            if (! isOk($movesRes['status'])) {
                throw new Exception('Failed to update team pokemon moves');
            }

            $this->updatedLastUpdated($tid);
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

    /**
     * @param  mixed  $tid
     */
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

    /**
     * @param  mixed  $data
     */
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

                if ($MovesService->getMoveCount($pid, $tid) != 0) {
                    continue;
                } else {
                    $movesRes = $MovesService->AssignRandomMoves(['tid' => $tid, 'pid' => $pid]);
                    if (! isOk($movesRes['status'])) {
                        error_log('Failed to assign moves');

                        throw new Exception('Failed to assign starter moves');
                    }
                }
            }

            $this->updatedLastUpdated($tid);
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

    /**
     * @param  mixed  $tid
     */
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
    pc.shiny_sprite_url,
	s.hp,
	s.attack,
	s.defense,
	s.spattack,
	s.spdefense,
	s.speed,
	m.mid
from
	team_pokemon tm
inner join pokemon_cache pc on
	pc.pid = tm.pid
inner join stats s on
	s.pid = tm.pid
left join moves m on
	m.pid = tm.pid
where
	tm.tid = ?
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
                    'is_shiny' => $poke['is_shiny'],
                    'sprite_url' => $poke['sprite_url'],
                    'shiny_sprite_url' => $poke['shiny_sprite_url'],
                    'level' => $poke['level'],
                    'type1' => $poke['type1'],
                    'type2' => $poke['type2'],
                    'stats' => [
                        ['name' => 'hp', 'value' => $poke['hp']],
                        ['name' => 'attack', 'value' => $poke['attack']],
                        ['name' => 'defense', 'value' => $poke['defense']],
                        ['name' => 'spattack', 'value' => $poke['spattack']],
                        ['name' => 'spdefense', 'value' => $poke['spdefense']],
                        ['name' => 'speed', 'value' => $poke['speed']],
                    ],
                    'moves' => [
                        ['mid' => $poke['mid']],
                    ],
                ];
            } else {
                $pokemon[$pid]['moves'][] = ['mid' => $poke['mid']];
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
