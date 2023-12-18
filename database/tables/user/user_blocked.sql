-- Represent users who are blocked by other users.

create table "user_has_blocked_user" (
    "id" serial primary key,
    "user_id" integer references "user"(id),
    "blocked_user_id" integer references "user"(id)
);

create or replace view "v_user_has_blocked_user" as select * from "user_has_blocked_user";

-- Get the blocked users for the specified user.

CREATE OR REPLACE FUNCTION get_user_blocked_users(p_user_id integer)
RETURNS SETOF "user_has_blocked_user" AS $$
BEGIN
    RETURN QUERY SELECT * FROM "user_has_blocked_user" WHERE "user_id" = p_user_id;
END;
$$ LANGUAGE plpgsql;

drop function "block_user";
create or replace function "block_user"(p_user_id integer, p_blocked_user_id integer)
returns text as $$
begin
    if exists (
        select * from "user_has_blocked_user"
        where ("user_id" = p_user_id and "blocked_user_id" = p_blocked_user_id)
    ) then
        return 'this user is already blocked.';
    else
        insert into "user_has_blocked_user" ("user_id", "blocked_user_id")
        values (p_user_id, p_blocked_user_id);
        return 'ok';
    end if;
end;
$$ language plpgsql;

drop function "unblock_user";
create or replace function "unblock_user"(p_user_id integer, p_blocked_user_id integer)
returns text as $$
begin
    delete from "user_has_blocked_user"
   where ("user_id" = p_user_id and "blocked_user_id" = p_blocked_user_id);
    
    if found then
        return 'ok';
    else
        return 'this user is not blocked.';
    end if;
end;
$$ language plpgsql;