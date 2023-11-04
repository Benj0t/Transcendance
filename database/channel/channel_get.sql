
-- Check if an user can moderate a channel

create or replace function can_moderate(p_moderator_id int, p_target_id int, p_channel_id int) returns boolean as $$
declare
    v_moderator_role int;
    v_target_role int;
begin

    if not is_member(p_moderator_id, p_channel_id) or v_target_role is null then
        return false;
    end if;

    select role into v_moderator_role from "channel_has_member" where user_id = p_moderator_id and channel_id = p_channel_id;
    select role into v_target_role from "channel_has_member" where user_id = p_target_id and channel_id = p_channel_id;

    return v_moderator_role < v_target_role;
end;
$$ language plpgsql;

-- Check if an user is member of the channel

create or replace function is_member(p_user_id int, p_channel_id int) returns boolean as $$
begin
    return exists(select 1 from "channel_has_member" where channel_id = p_channel_id and user_id = p_user_id);
end;
$$ language plpgsql;

-- Returns the private channel id between two users.

create or replace function get_private_channel_id(p_user1_id int, p_user2_id int) returns int as $$
declare
    v_channel_id int;
begin
    select channel_id into v_channel_id from "channel_has_member"
    where user_id in (p_user1_id, p_user2_id)
    group by channel_id
    having bool_and(is_private = true) and count(*) = 2;
    
    return v_channel_id;
end;
$$ language plpgsql;

-- Owner check

create or replace function is_owner(p_user_id int, p_channel_id int) returns boolean as $$
declare
    v_role int;
begin
    if !is_member(p_user_id, p_channel_id) then
        return false;
    end if;

    select role into v_role from "channel_has_member" where channel_id = p_channel_id and user_id = p_user_id;
    return v_role = 0;
end;
$$ language plpgsql;

-- Admin check

create or replace function is_admin(p_user_id int, p_channel_id int) returns boolean as $$
declare
    v_role int;
begin
    if !is_member(p_user_id, p_channel_id) then
        return false;
    end if;
    select role into v_role from "channel_has_member" where channel_id = p_channel_id and user_id = p_user_id;
    return v_role = 1;
end;
$$ language plpgsql;