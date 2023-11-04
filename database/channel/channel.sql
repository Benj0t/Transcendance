
-- A channel

create table channel (
    "id" serial primary key,
    "title" text not null,
    "is_private" boolean not null,
    "password" text,
    "owner_id" int references "user"(id)
);

-- Channel has member

create table channel_has_member (
    "channel_id" int references "channel"(id),
    "user_id" int references "user"(id),
    "role" int check (role in (0, 1, 2)), -- 0 pour owner, 1 pour admin, 2 pour member
    "mute_expiry_at" timestamptz,
    primary key (channel_id, user_id)
);

-- Channel has message

create table channel_has_message (
    "channel_id" int references "channel"(id),
    "user_id" int references "user"(id),
    "message" text not null,
    "created_at" timestamptz default current_timestamp,
    primary key (channel_id, created_at)
);

-- Channel has banned user

create table channel_has_banned_user (
    "channel_id" int references "channel"(id),
    "user_id" int references "user"(id),
    "expiry_at" timestamptz,
    primary key (channel_id, user_id)
);