
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

    if v_password is not null and (p_password is distinct from v_password) then
        return 'Incorrect password.';
    end if;

    insert into "channel_has_member" (channel_id, user_id, role) values (p_channel_id, p_user_id, 2);
    
    return 'ok';
end;
$$ language plpgsql;
