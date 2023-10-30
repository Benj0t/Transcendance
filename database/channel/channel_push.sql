
-- Send a message to a channel

create or replace function send_message(p_user_id int, p_channel_id int, p_message text) returns text as $$
declare
    v_mute_expiry timestamptz;
    is_member boolean;
begin
    if not is_member(p_user_id, p_channel_id) then
        return 'User not member of this channel.';
    end if;

    select mute_expiry_at into v_mute_expiry from "channel_has_member" where channel_id = p_channel_id and user_id = p_user_id;
    
    if v_mute_expiry is not null and v_mute_expiry >= current_timestamp then
        return 'User already muted.';
    end if;
    
    insert into "channel_has_message" (channel_id, user_id, message) values (p_channel_id, p_user_id, p_message);
    return 'ok';
end;
$$ language plpgsql;