<?php

require_once __DIR__.'/../db/db.php';
require_once __DIR__.'/../utils.php';

class UserService
{
    private function doesUserExist($email)
    {
        global $db;
        $stmt = $db->prepare('select email from user where email = ?');
        $stmt->bindParam(1, $email);
        $stmt->execute();
        $res = $stmt->fetchAll();

        return count($res) >= 1;
    }

    private function doesUserExistId($id)
    {
        global $db;
        $stmt = $db->prepare('select uid from user where uid = ?');
        $stmt->bindParam(1, $id);
        $stmt->execute();
        $res = $stmt->fetchAll();

        return count($res) >= 1;
    }

    private function usernameTaken($username)
    {
        global $db;
        $stmt = $db->prepare('select username from user where username = ?');
        $stmt->bindParam(1, $username);
        $stmt->execute();
        $res = $stmt->fetchAll();

        return count($res) >= 1;
    }

    public function SignUp($data)
    {
        $fname = $data['fname'];
        $lname = $data['lname'];
        $email = $data['email'];
        $uname = $data['username'];
        $password = $data['password'];

        if ($this->doesUserExist($email)) {
            return [
                'status' => 400,
                'data' => 'User already exists',
            ];
        }

        if ($this->usernameTaken($uname)) {
            return [
                'status' => 400,
                'data' => 'Username already taken',
            ];
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);

        global $db;
        $stmt = $db->prepare('insert into user (fname, lname, username, email, passhash) values (?, ?, ?,?, ?)');
        $stmt->bindParam(1, $fname);
        $stmt->bindParam(2, $lname);
        $stmt->bindParam(3, $uname);
        $stmt->bindParam(4, $email);
        $stmt->bindParam(5, $hash);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to add user',
            ];
        }

        return [
            'status' => 201,
            'data' => ['msg' => 'User created successfully'],
        ];
    }

    public function Login($email, $password)
    {
        if (! $this->doesUserExist($email)) {
            return [
                'status' => 400,
                'data' => 'User does not exist',
            ];
        }

        global $db;
        $stmt = $db->prepare('select * from user where email = ?');
        $stmt->bindParam(1, $email);
        $stmt->execute();
        $res = $stmt->fetchAll()[0];
        $hash = $res['passhash'];

        if (! password_verify($password, $hash)) {
            return [
                'status' => 401,
                'data' => 'Incorrect password',
            ];
        }

        return [
            'status' => 200,
            'data' => [
                'uid' => $res['uid'],
                'uname' => $res['username'],
                'fname' => $res['fname'],
                'lname' => $res['lname'],
                'email' => $res['email'],
            ]];
    }

    public function Delete(int $id)
    {
        if (! $this->doesUserExistId($id)) {
            return [
                'status' => 400,
                'data' => 'User does not exist',
            ];
        }

        global $db;
        $stmt = $db->prepare('delete from user where uid = ?');
        $stmt->bindParam(1, $id);
        if (! $stmt->execute()) {
            return [
                'status' => 500,
                'data' => 'Failed to delete user',
            ];
        }

        return [
            'status' => 200,
            'data' => 'User deleted successfully',
        ];

    }
}
