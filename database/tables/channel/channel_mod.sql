-- Mute an user in the specified channel.

create or replace function mute_user(p_moderator_id int, p_target_id int, p_channel_id int, p_mute_time interval)
returns text as $$
begin

    if not is_member(p_moderator_id, p_channel_id) then
        return 'User not member of this channel.';
    end if;
    
    if not can_moderate(p_moderator_id, p_target_id, p_channel_id) then
        return 'User not permitted to mute.';
    end if;

    update channel_has_member set mute_expiry_at = current_timestamp + p_mute_time where channel_id = p_channel_id and user_id = p_target_id;
    return 'ok';
end;
$$ language plpgsql;

-- Check if user is muted on a channel.

create or replace function check_mute(p_target_id int, p_channel_id int)
returns text as $$
declare
    v_mute_timer timestamp;
    v_current_timer timestamp := current_timestamp;
begin
    if not is_member(p_target_id, p_channel_id) then
        return 'User not member of this channel.';
    end if;

    select mute_expiry_at into v_mute_timer from channel_has_member where channel_id = p_channel_id and user_id = p_target_id;

   if v_mute_timer is not null and v_mute_timer > v_current_timer then
        return 'User is muted';
    end if;

    return 'ok';
end;
$$ language plpgsql;

-- Unmute an user in the specified channel.

create or replace function unmute_user(p_moderator_id int, p_target_id int, p_channel_id int)
returns text as $$
begin
    if not is_member(p_moderator_id, p_channel_id) then
        return 'User not member of this channel.';
    end if;

    if not can_moderate(p_moderator_id, p_target_id, p_channel_id) then
        return 'User not permitted to unmute.';
    end if;

    update channel_has_member set mute_expiry_at = null where channel_id = p_channel_id and user_id = p_target_id;
    return 'ok';
end;
$$ language plpgsql;


-- Kick an user from the specified channel.

create or replace function kick_user(p_moderator_id int, p_target_id int, p_channel_id int)
returns text as $$
begin

    if not is_member(p_moderator_id, p_channel_id) then
        return 'User not member of this channel.';
    end if;
    
    if not can_moderate(p_moderator_id, p_target_id, p_channel_id) then
        return 'User not permitted to kick.';
    end if;

    delete from "channel_has_member" where channel_id = p_channel_id and user_id = p_target_id;
    return 'ok';
end;
$$ language plpgsql;

-- Ban an user from the specified channel.

create or replace function ban_user(p_moderator_id int, p_target_id int, p_channel_id int, p_ban_time interval)
returns text as $$
declare
    is_already_banned boolean;
begin

    if not is_member(p_moderator_id, p_channel_id) then
        return 'User not member of this channel.';
    end if;
    
    if not can_moderate(p_moderator_id, p_target_id, p_channel_id) then
        return 'User not permitted to ban.';
    end if;
    
    select exists(select 1 from v_active_channel_has_banned_user where channel_id = p_channel_id and user_id = p_target_id) into is_already_banned;
    
    if is_already_banned then
        return 'User already banned.';
    end if;

    insert into "channel_has_banned_user" (channel_id, user_id, expiry_at) values (p_channel_id, p_target_id, current_timestamp + p_ban_time);
    
    delete from "channel_has_member" where channel_id = p_channel_id and user_id = p_target_id;

    return 'ok';
end;
$$ language plpgsql;

-- Pardon (Unban) an user from the specified channel.

create or replace function pardon_user(p_moderator_id int, p_target_id int, p_channel_id int)
returns text as $$
begin
    if not is_member(p_moderator_id, p_channel_id) then
        return 'User not member of this channel.';
    end if;

    if not can_moderate(p_moderator_id, p_target_id, p_channel_id) then
        return 'User not permitted to pardon.';
    end if;

    update "channel_has_banned_user" set "pardonned" = true where channel_id = p_channel_id and user_id = p_target_id;
    return 'ok';
end;
$$ language plpgsql;

-- Set an user operator for the specified channel.

create or replace function op_user(p_owner_id int, p_target_id int, p_channel_id int)
returns text as $$
declare
    v_owner_role int;
    is_already_admin boolean;
begin

    if not is_member(p_owner_id, p_channel_id) then
        return 'User not member of this channel.';
    end if;

    select role into v_owner_role from channel_has_member where user_id = p_owner_id and channel_id = p_channel_id;
    
    if v_owner_role <> 0 then
        return 'User not permitted to promote because he is not owner of this channel.';
    end if;

    select exists(select 1 from channel_has_member where channel_id = p_channel_id and user_id = p_target_id and role = 1) into is_already_admin;
    
    if is_already_admin then
        return 'User already administrator.';
    end if;

   update channel_has_member set role = 1 where channel_id = p_channel_id and user_id = p_target_id;
    
    return 'ok';
end;
$$ language plpgsql;

-- Demote an user from administrator to member for the specified channel.

create or replace function deop_user(p_owner_id int, p_target_id int, p_channel_id int)
returns text as $$
declare
    v_owner_role int;
    is_already_not_admin boolean;
begin
   
    if not is_member(p_owner_id, p_channel_id) then
        return 'User not member of this channel.';
    end if;

    select role into v_owner_role from channel_has_member where user_id = p_owner_id and channel_id = p_channel_id;
    
    if v_owner_role <> 0 then
        return 'User not permitted to demote because he is not owner of this channel.';
    end if;
    
    select exists(select 1 from channel_has_member where channel_id = p_channel_id and user_id = p_target_id and role <> 1) into is_already_not_admin;
    
    if is_already_not_admin then
        return 'User is not an administrator.';
    end if;

    update channel_has_member set role = 2 where channel_id = p_channel_id and user_id = p_target_id;
    
    return 'ok';
end;
$$ language plpgsql;

-- Change password of a channel

create or replace function change_password(p_owner_id int, p_channel_id int, p_new_pass text)
returns text as $$
declare
    v_owner_role int;
begin
    select role into v_owner_role from channel_has_member where user_id = p_owner_id and channel_id = p_channel_id;
    
    if v_owner_role <> 0 then
        return 'User not permitted to change password of this channel.';
    end if;

    update channel set password = p_new_pass where id = p_channel_id;

    -- if p_new_pass = '' then
    --     update channel set is_private = false where id = p_channel_id;
    -- else
    --     update channel set is_private = true where id = p_channel_id;
    -- end if;

    return 'ok';
end;
$$ language plpgsql;