-- drop database if exists webtech_fall2024_madiba_quansah;
drop table if exists stats;

drop table if exists moves;

drop table if exists team_pokemon;

drop table if exists team;

drop table if exists user;

-- drop table if exists pokemon_cache;

-- create database if not exists webtech_fall2024_madiba_quansah;
use webtech_fall2024_madiba_quansah;

create table if not exists user (
  uid int auto_increment primary key,
  fname varchar(100) not null,
  lname varchar(100) not null,
  dob datetime NOT NULL default current_timestamp(),
  username varchar(50) unique not null,
  email varchar(100) unique not null,
  passhash varchar(255) not null,
  is_admin boolean not null default false,
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
  pid int unique not null,
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
  primary key (mid, pid, tid),
  foreign key (pid, tid) references team_pokemon (pid, tid) on delete cascade
);

create table stats (
  sid int auto_increment primary key,
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
  ),
  check (
    attack > 0
  ),
  check (
    defense > 0
  ),
  check (
    spattack > 0
  ),
  check (
    spdefense > 0
  ),
  foreign key (pid, tid) references team_pokemon (pid, tid) on delete cascade
);

create table if not exists pokemon_cache (
  pid int primary key,
  name varchar(50) not null,
  type1 varchar(20) not null,
  type2 varchar(20),
  sprite_url varchar(255),
  shiny_sprite_url varchar(255),
  last_updated datetime not null default current_timestamp on update current_timestamp
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
create index stats_exist on stats (tid, pid);

create index team_pokemon_exist on team_pokemon (tid, pid);

create index moves_exist on moves (tid, pid);
