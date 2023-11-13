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