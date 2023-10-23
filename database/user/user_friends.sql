-- Represent a friendship between two users.

drop table "user_has_friend";
create table "user_has_friend" (
	"id" serial primary key,
    "user_id" integer references "user"(id),
    "friend_id" integer references "user"(id)
);

drop view "v_user_has_friend";
create or replace view "v_user_has_friend" as select * from "user_has_friend";

-- Get the friendships for the specified user.

drop function "get_user_friendships";
create or replace function "get_user_friendships"(user_id integer)
returns setof "v_user_has_friend" as $$
begin
    return query select * from "v_user_has_friend" where user_id = user_id;
end;
$$ language plpgsql;

-- Gauthier friend with Benjamin

insert into "user_has_friend" ("userId", "friendId") values (
    18, 19
);

-- Add friend for the specified user.

drop function "add_user_friend";
create or replace function "add_user_friend"(p_user_id integer, p_friend_id integer)
returns text as $$
begin
    if exists (
        select * from "user_has_friend"
        where "user_id" = p_user_id and "friend_id" = p_friend_id
    ) then
        return 'already friend with this user.';
    else
        insert into "user_has_friend" ("user_id", "friend_id")
        values (p_user_id, p_friend_id);
        return 'ok';
    end if;
end;
$$ language plpgsql;

-- Remove friend for the specified user.

drop function "remove_user_friend";
create or replace function "remove_user_friend"(user_id integer, friend_id integer)
returns text as $$
begin
    delete from "user_has_friend"
    where "user_id" = user_id and "friend_id" = friend_id;
    
    if found then
        return 'ok';
    else
        return 'not friend with this user.';
    end if;
exception
    when others then
        return 'error';
end;
$$ language plpgsql;