drop schema if exists public cascade;
create schema public;	


-- User Table
CREATE TABLE "user" (
  uid SERIAL PRIMARY KEY,
  fname VARCHAR(100) NOT NULL,
  lname VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  passhash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT email_format CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
);

-- Team Table
CREATE TABLE team (
  tid SERIAL PRIMARY KEY,
  uid INT NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_team_user FOREIGN KEY (uid) REFERENCES "user" (uid) ON DELETE CASCADE
);

-- Trigger to update "updated_at" column in "team" table
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_timestamp
BEFORE UPDATE ON team
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Team Pokemon Table
CREATE TABLE team_pokemon (
  pid INT NOT NULL,
  tid INT NOT NULL,
  is_shiny BOOLEAN NOT NULL DEFAULT FALSE,
  level INT NOT NULL,
  nickname VARCHAR(100),
  PRIMARY KEY (pid, tid),
  CONSTRAINT fk_team_pokemon_team FOREIGN KEY (tid) REFERENCES team (tid) ON DELETE CASCADE,
  CONSTRAINT level_range CHECK (level >= 0 AND level <= 100)
);

-- Moves Table
CREATE TABLE moves (
  mid INT NOT NULL,
  pid INT NOT NULL,
  tid INT NOT NULL,
  PRIMARY KEY (mid, pid, tid),
  CONSTRAINT fk_moves_team_pokemon FOREIGN KEY (pid, tid) REFERENCES team_pokemon (pid, tid) ON DELETE CASCADE
);

-- Stats Table
CREATE TABLE stats (
  sid SERIAL PRIMARY KEY,
  pid INT NOT NULL,
  tid INT NOT NULL,
  hp INT NOT NULL CHECK (hp > 0),
  attack INT NOT NULL CHECK (attack > 0),
  defense INT NOT NULL CHECK (defense > 0),
  spattack INT NOT NULL CHECK (spattack > 0),
  spdefense INT NOT NULL CHECK (spdefense > 0),
  speed INT NOT NULL,
  CONSTRAINT fk_stats_team_pokemon FOREIGN KEY (pid, tid) REFERENCES team_pokemon (pid, tid) ON DELETE CASCADE
);

-- Pokemon Cache Table
CREATE TABLE IF NOT EXISTS pokemon_cache (
  pid INT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  type1 VARCHAR(20),
  type2 VARCHAR(20),
  sprite_url VARCHAR(255),
  shiny_sprite_url VARCHAR(255),
  last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to limit team_pokemon entries
CREATE OR REPLACE FUNCTION enforce_team_pokemon_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM team_pokemon WHERE tid = NEW.tid) >= 6 THEN
    RAISE EXCEPTION 'A team cannot have more than 6 Pokémon.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER team_pokemon_limit
BEFORE INSERT ON team_pokemon
FOR EACH ROW
EXECUTE FUNCTION enforce_team_pokemon_limit();

-- Indexes
CREATE INDEX stats_exist ON stats (tid, pid);
CREATE INDEX team_pokemon_exist ON team_pokemon (tid, pid);
CREATE INDEX moves_exist ON moves (tid, pid);
