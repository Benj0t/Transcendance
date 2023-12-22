
-- Get a channel's password

create or replace function get_channel_pass(p_channel_id int) returns text as $$
declare
    v_password text;
begin
    begin
        select password into v_password from "channel" where id = p_channel_id;
    exception
        when no_data_found then
            return 'Channel does not exist.';
    end;
    return v_password;
end;
$$ language plpgsql;

create or replace function join_channel(p_user_id int, p_channel_id int, p_password text) returns text as $$
declare
    v_password text;
    v_is_private boolean;
    v_ban_timer timestamp;
    v_current_timer timestamp := current_timestamp;

begin
    select is_private, password into v_is_private, v_password from "channel" where id = p_channel_id;
    select expiry_at into v_ban_timer from "channel_has_banned_user" where channel_id = p_channel_id and user_id = p_user_id;

    if v_ban_timer is not null and v_ban_timer > v_current_timer then
        return 'User is banned';
    end if;

    if v_is_private then
        return 'Cannot join a direct message channel.';
    end if;
    
    if is_member(p_user_id, p_channel_id) then
        return 'Already a member.';
    end if;

    -- if v_password is not null and (p_password is distinct from v_password) then
    --     return 'Incorrect password.';
    -- end if;

    insert into "channel_has_member" (channel_id, user_id, role) values (p_channel_id, p_user_id, 2);
    
    return 'ok';
end;
$$ language plpgsql;

-- Leave a channel

create or replace function leave_channel(p_user_id int, p_channel_id int) returns text as $$
begin

    if not is_member(p_user_id, p_channel_id) then
        return 'User is not a member of the channel.';
    end if;

   if (select owner_id from "channel" where id = p_channel_id) = p_user_id then
       return 'Channel owner cannot leave the channel. Please delete the channel or transfer ownership first.';
   end if;

    delete from "channel_has_member" where user_id = p_user_id and channel_id = p_channel_id;
    
    return 'ok';
end;
$$ language plpgsql;