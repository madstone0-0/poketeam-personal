drop database if exists webtech_fall2024_madiba_quansah;

-- drop table if exists team;
-- drop table if exists team_pokemon;
-- drop table if exists user;
-- drop table if exists stats;
create database if not exists webtech_fall2024_madiba_quansah;

use webtech_fall2024_madiba_quansah;

create table user (
  uid int auto_increment primary key,
  fname varchar(100) not null,
  lname varchar(100) not null,
  username varchar(50) unique not null,
  email varchar(100) not null,
  passhash varchar(255) not null,
  check (
    email regexp '^[a-za-z0-9._%+-]+@[a-za-z0-9.-]+\\.[a-za-z]{2,}$'
  )
);

create table team (
  tid int auto_increment primary key,
  uid int not null,
  team_name varchar(255) not null,
  created_at datetime not null default current_timestamp,
  updated_at datetime not null default current_timestamp on update current_timestamp,
  foreign key (uid) references user (uid) on delete cascade
);

create table team_pokemon (
  pid int not null,
  tid int not null,
  is_shiny boolean not null default false,
  level int not null,
  nickname varchar(100),
  primary key (pid, tid),
  foreign key (tid) references team (tid) on delete cascade,
  check (
    level >= 0
    and level <= 100
  )
);

create table moves (
  mid int not null,
  pid int not null,
  tid int not null,
  slot int not null,
  check (slot between 1 and 4),
  primary key (mid, pid, tid, slot),
  foreign key (pid, tid) references team_pokemon (pid, tid) on delete cascade
);

create table stats (
  sid int not null,
  pid int not null,
  tid int not null,
  hp int not null,
  attack int not null,
  defense int not null,
  spattack int not null,
  spdefense int not null,
  speed int not null,
  check (
    hp > 0
    and hp <= 255
  ),
  check (
    attack > 0
    and attack <= 255
  ),
  check (
    defense > 0
    and defense <= 255
  ),
  check (
    spattack > 0
    and spattack <= 255
  ),
  check (
    spdefense > 0
    and spdefense <= 255
  ),
  foreign key (pid, tid) references team_pokemon (pid, tid) on delete cascade
);

create table pokemon_cache (
  pid int primary key,
  name varchar(50) not null,
  type1 varchar(20) not null,
  type2 varchar(20),
  sprite_url varchar(255),
  last_updated datetime not null default current_timestamp
);

-- create trigger team_pokemon_limit before insert on team_pokemon for each row begin if (
--   select
--     count(*)
--   from
--     team_pokemon
--   where
--     tid = new.tid
-- ) >= 6 then signal sqlstate '45000'
-- set
--   message_text = 'a team cannot have more than 6 pokémon.';
-- 
-- end if;
-- 
-- end;
-- Insert sample users
INSERT INTO
  user (fname, lname, username, email, passhash)
VALUES
  (
    'Ash',
    'Ketchum',
    'ashk',
    'ash@example.com',
    'hashedpassword1'
  ),
  (
    'Misty',
    'Waterflower',
    'mistyw',
    'misty@example.com',
    'hashedpassword2'
  ),
  (
    'Brock',
    'Slate',
    'brockslate',
    'brock@example.com',
    'hashedpassword3'
  );

-- Insert sample teams
INSERT INTO
  team (uid, team_name)
VALUES
  (1, 'Ash\'s Pikachu Squad'),
  (2, 'Misty\'s Water Team'),
  (3, 'Brock\'s Rock Crew');

-- Insert sample Pokémon in teams
INSERT INTO
  team_pokemon (pid, tid, is_shiny, level, nickname)
VALUES
  (25, 1, false, 50, 'Pikachu'), -- Pikachu in Ash's team
  (6, 1, false, 60, 'Charizard'), -- Charizard in Ash's team
  (7, 2, true, 45, 'Squirtle'), -- Squirtle in Misty's team
  (131, 2, false, 55, 'Lapras'), -- Lapras in Misty's team
  (74, 3, false, 30, 'Geodude'), -- Geodude in Brock's team
  (95, 3, true, 40, 'Onix');

-- Onix in Brock's team
-- Insert moves for Pokémon
INSERT INTO
  moves (mid, pid, tid, slot)
VALUES
  (1, 25, 1, 1), -- Thunderbolt for Pikachu
  (2, 25, 1, 2), -- Quick Attack for Pikachu
  (3, 6, 1, 1), -- Flamethrower for Charizard
  (4, 6, 1, 2), -- Fly for Charizard
  (5, 7, 2, 1), -- Water Gun for Squirtle
  (6, 131, 2, 1), -- Ice Beam for Lapras
  (7, 74, 3, 1), -- Rock Throw for Geodude
  (8, 95, 3, 1);

-- Rock Slide for Onix
-- Insert stats for Pokémon
INSERT INTO
  stats (
    sid,
    pid,
    tid,
    hp,
    attack,
    defense,
    spattack,
    spdefense,
    speed
  )
VALUES
  (1, 25, 1, 120, 55, 40, 50, 50, 90), -- Stats for Pikachu
  (2, 6, 1, 150, 84, 78, 109, 85, 100), -- Stats for Charizard
  (3, 7, 2, 60, 48, 65, 50, 64, 43), -- Stats for Squirtle
  (4, 131, 2, 130, 85, 80, 85, 95, 60), -- Stats for Lapras
  (5, 74, 3, 40, 80, 100, 30, 30, 20), -- Stats for Geodude
  (6, 95, 3, 35, 45, 160, 30, 45, 70);

-- Stats for Onix
-- Insert cached Pokémon metadata
INSERT INTO
  pokemon_cache (pid, name, type1, type2, sprite_url)
VALUES
  (
    25,
    'Pikachu',
    'Electric',
    NULL,
    'https://pokeapi.co/sprites/pokemon/25.png'
  ),
  (
    6,
    'Charizard',
    'Fire',
    'Flying',
    'https://pokeapi.co/sprites/pokemon/6.png'
  ),
  (
    7,
    'Squirtle',
    'Water',
    NULL,
    'https://pokeapi.co/sprites/pokemon/7.png'
  ),
  (
    131,
    'Lapras',
    'Water',
    'Ice',
    'https://pokeapi.co/sprites/pokemon/131.png'
  ),
  (
    74,
    'Geodude',
    'Rock',
    'Ground',
    'https://pokeapi.co/sprites/pokemon/74.png'
  ),
  (
    95,
    'Onix',
    'Rock',
    'Ground',
    'https://pokeapi.co/sprites/pokemon/95.png'
  );
