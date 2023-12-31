#!/bin/bash

SQL_DIR="/etc/tables"

SQL_FILES=(
  "user/user.sql"
  "user/user_blocked.sql"
  "user/user_friends.sql"
  "user/user_rank.sql"
  "achievement/achievement.sql"
  "channel/channel.sql"
  "channel/channel_create.sql"
  "channel/channel_get.sql"
  "channel/channel_join.sql"
  "channel/channel_mod.sql"
  "channel/channel_push.sql"
  "match/match.sql"
  "rank/rank.sql"
)

for file in "${SQL_FILES[@]}"; do
  psql -U app -d transcendance -f "$SQL_DIR/$file"
done