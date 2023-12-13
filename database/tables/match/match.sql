
-- Represent a match.

drop table "match";
create table "match" (
    "id" serial primary key,
    "user_id" integer references "user"(id),
    "opponent_id" integer references "user"(id),
    "winner_id" integer references "user"(id),
    "score_user_1" integer default 0,
    "score_user_2" integer default 0,
    "match_duration" integer default 0,
    "created_at" timestamp default current_timestamp
);

drop view "v_match";
create or replace view "v_match" as select * from "match";

-- Add a match for the specified users.

drop function "add_match";
create or replace function "add_match"(p_user_id integer, p_opponent_id integer, p_winner_id integer, p_score_1 integer, p_score_2 integer, p_duration integer)
returns text as $$
begin
    insert into "match" ("user_id", "opponent_id", "winner_id", "score_user_1", "score_user_2", "match_duration")
    values (p_user_id, p_opponent_id, p_winner_id, p_score_1, p_score_2, p_duration);
    return 'ok';
end;
$$ language plpgsql;

-- Get the match history for the specified user.

drop function "get_user_matches";
create or replace function "get_user_matches"(p_user_id integer)
returns setof v_match as $$
begin
    return query select * from "v_match" where "user_id" = p_user_id or "opponent_id" = p_user_id;
end;
$$ language plpgsql;