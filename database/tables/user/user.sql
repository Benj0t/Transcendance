
-- Represent an user.

create table "user"
(
    "id" serial primary key,
    "nickname" text unique not null,
    "avatar_base64" text,
    "two_factor_secret" text unique default null,
    "two_factor_enable" boolean default false,
	"user_42_id" integer unique,
    "color_hex" text default 'fffff'
);

create or replace view "v_user" as select * from "user";

insert into "user" ("nickname", "avatar_base64", "two_factor_secret", "user_42_id") values (
    'benjamin', 'img_base64_here', null, 1234
);

-- Represent user's achievements.

create table "achievement" (
    "id" serial primary key,
    "name" varchar(50),
	"caption" text,
    "icon_url" varchar(255)
);

create table "user_has_achievement" (
    "id" serial primary key,
    "user_id" integer references "user"(id),
    "achievement_id" integer references "achievement"(id),
    "timestamp" timestamp default current_timestamp
);

create or replace view "v_user_has_achievement" as select * from "user_has_achievement";

-- Get the achievements for the specified user.

create or replace function "get_user_achievements"(user_id integer)
returns setof "v_user_has_achievement" as $$
begin
    return query select * from "v_user_has_achievement" where user_id = user_id;
end;
$$ language plpgsql;

-- Upsert an user

create or replace function "upsert_user"(p_user_42_id integer, p_nickname text, p_avatar_base64 text)
returns setof "user" as $$
declare
    v_user_id integer;
begin
    insert into "user" (nickname, avatar_base64, user_42_id)
    values (p_nickname, p_avatar_base64, p_user_42_id)
    on conflict (user_42_id) do nothing;
    
    return query select * from "user" where user_42_id = p_user_42_id;
end;
$$ language plpgsql;
