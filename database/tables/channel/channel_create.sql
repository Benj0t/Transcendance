-- Create a channel

create or replace function create_channel(p_title text, p_members int [], p_is_private boolean, p_password text)
returns text as $$
declare
    v_channel_id int;
    v_member_count int;
    v_existing_private_channel int;
    v_member int;
begin

    if p_members is null then
        return 'The members array must not be null.';
    end if;

    if p_is_private then

        select count(*) into v_member_count from unnest(p_members);

        if v_member_count <> 2 then
            return 'A private channel must contains 2 members.';
        end if;
        
        select get_private_channel_id(p_members[1], p_members[2]) into v_existing_private_channel;
        if v_existing_private_channel is not null then
            return 'There is already a private channel between these users.';
        end if;

    end if;
    
    insert into "channel" (title, is_private, password, owner_id) values (p_title, p_is_private, p_password, p_members[1])
    returning id into v_channel_id;
    
    foreach v_member in array p_members loop
        insert into "channel_has_member" (channel_id, user_id, role) values (v_channel_id, v_member, 2);
    end loop;
    
    update "channel_has_member" set role = 0 where channel_id = v_channel_id and user_id = p_members[1];
    
    return 'ok';
end;
$$ language plpgsql;

-- Delete a channel 
create or replace function delete_channel(p_channel_id INT)
returns text as $$
BEGIN

    IF NOT EXISTS(SELECT 1 FROM "channel" where id = p_channel_id) THEN
        return 'Channel does not exist.';
    END IF;

    delete from "channel_has_banned_user" where channel_id = p_channel_id;

    delete from "channel_has_member" where channel_id = p_channel_id;

    delete from "channel_has_message" where channel_id = p_channel_id;

    delete from "channel" where id = p_channel_id;

    return 'ok.';
END;
$$ LANGUAGE plpgsql;
