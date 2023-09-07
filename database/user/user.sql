
-- Represent an user.

create table "user"
(
    "id" serial primary key,
    "nickname" varchar(50) unique not null,
    "email" varchar(50),
    "avatar_url" varchar(255) default 'default_avatar.png',
    "two_factor_auth" boolean default false,
);

create or replace view "v_user" as select * from "user";

-- Represent a friendship between two users.

create table "user_has_friend" (
	"id" serial primary key
    "user_id" integer references "user"(id),
    "friend_id" integer references "user"(id),
);

create or replace view "v_user_has_friend" as select * from "user_has_friend";

-- Represent a match.

create table "match" (
    "id" serial primary key,
    "user_id" integer references "user"(id),
    "opponent_id" integer references "user"(id),
    "winner_id" integer references "user"(id),
    "created_at" timestamp default current_timestamp
);

create or replace view "v_match" as select * from "match";

-- Represent user's achievements.
create table "user_has_achievement" (
    "id" serial primary key,
    "user_id" integer references "user"(id),
    "achievement_id" integer references "achievement"(id),
    timestamp timestamp default current_timestamp
);

create or replace view "v_user_has_achievement" as select * from "user_has_achievement";

-- Returns the number of victories for the specified user.

create or replace function "get_user_victories"(user_id integer)
returns integer as $$
declare
    victories integer;
begin
    select count(*) into victories from "match"
    where winner_id = user_id;
    return victories;
end;
$$ language plpgsql;

-- Returns the number of defeats for the specified user.

create or replace function "get_user_defeats"(user_id integer)
returns integer as $$
declare
    defeats integer;
begin
    select count(*) into defeats from "match"
    where ("user_id" = user_id or opponent_id = user_id) and winner_id != user_id;
    return defeats;
end;
$$ language plpgsql;

-- Returns the number of xp for the specified user.

create or replace function "get_user_total_xp"(user_id integer)
returns integer as $$
declare
    total_xp integer;
begin
    select (15 * get_user_victories(user_id)) + (5 * get_user_defeats(user_id)) into total_xp;
    return total_xp;
end;
$$ language plpgsql;

-- Get the user rank id for the specified user.

create or replace function "get_user_rank_id"(user_id integer)
returns integer as $$
declare
    total_xp integer;
	max_rank integer;
    rank_id integer;
begin

    select get_user_total_xp(user_id) into total_xp;
	select max(id) from "rank" into max_rank;
    
    rank_id := least(ceil(total_xp / 500.0), max_rank);

    return rank_id;
end;
$$ language plpgsql;

-- Get the friendships for the specified user.

create or replace function "get_user_friendships"(user_id integer)
returns setof "v_user_has_friend" as $$
begin
    return query select * from "v_user_has_friend" where user_id = user_id;
end;
$$ language plpgsql;

-- Get the match history for the specified user.

create or replace function "get_user_matches"(user_id integer)
returns setof v_match as $$
begin
    return query select * from "v_match" where user_id = user_id or opponent_id = user_id;
end;
$$ language plpgsql;

-- Get the achievements for the specified user.

create or replace function "get_user_achievements"(user_id integer)
returns setof "v_user_has_achievement" as $$
begin
    return query select * from "v_user_has_achievement" where user_id = user_id;
end;
$$ language plpgsql;
