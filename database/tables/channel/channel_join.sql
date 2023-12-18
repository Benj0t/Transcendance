
-- Get a channel's password

create or replace function get_channel_pass(p_channel_id int) returns text as $$
declare
    v_password text;
begin
    select password into v_password from "channel" where id = p_channel_id;
    return v_password;
end;
$$ language plpgsql;

-- Join a channel

create or replace function join_channel(p_user_id int, p_channel_id int, p_password text) returns text as $$
declare
    v_password text;
    v_is_private boolean;
begin
    select is_private, password into v_is_private, v_password from "channel" where id = p_channel_id;

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