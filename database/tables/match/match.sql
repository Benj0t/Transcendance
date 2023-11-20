
-- Represent a match.

drop table "match";
create table "match" (
    "id" serial primary key,
    "user_id" integer references "user"(id),
    "opponent_id" integer references "user"(id),
    "winner_id" integer references "user"(id),
    "created_at" timestamp default current_timestamp
);

drop view "v_match";
create or replace view "v_match" as select * from "match";

-- Add a match for the specified users.

drop function "add_match";
create or replace function "add_match"(p_user_id integer, p_opponent_id integer, p_winner_id integer)
returns text as $$
begin
    insert into "match" ("user_id", "opponent_id", "winner_id")
    values (p_user_id, p_opponent_id, p_winner_id);
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