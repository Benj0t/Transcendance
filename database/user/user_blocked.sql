-- Represent users who are blocked by other users.

create table "user_has_blocked_user" (
    "id" serial primary key,
    "user_id" integer references "user"(id),
    "blocked_user_id" integer references "user"(id)
);

insert into "user_has_blocked_user" ("user_id", "blocked_user_id") values (
	18, 19
);

create or replace view "v_user_has_blocked_user" as select * from "user_has_blocked_user";

-- Get the blocked users for the specified user.

drop function "get_user_blocked_users";
create or replace function "get_user_blocked_users"(p_user_id integer)
returns setof "v_user_has_blocked_user" as $$
begin
    return query select * from "v_user_has_blocked_user" where user_id = p_user_id;
end;
$$ language plpgsql;