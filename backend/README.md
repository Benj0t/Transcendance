**API DOCUMENTATION**

```-```

✅ `GET` /auth/callback                              Authenticade an user with 42 API.
?code={code}

✅ `GET` /user/                                 	    Get all users.
✅ `GET` /user/{id}                                  Get an user.
`POST` /user/{user}                                  Update user settings
?username={name} & color={color} & ...

✅ `GET` /user/{user}/avatar                         Get the avatar for an user.
1️⃣ `POST` /user/{user}/avatar                    	  Update the avatar for an user
?avatar_base64={avatar_base64}

✅ `GET` /user/{user}/friends                        Get the friends for an user.
✅ `POST` /user/{user}/friend                        Add a friend for an user
?friend_id={friend}
✅ `DELETE` /user/{user}/friend                      Remove a friend for an user
?friend_id={friend}

✅ `GET` /user/{user}/matches                        Get the matches for an user.
✅ `POST` /user/{user}/match                         Add a match for an user
?user_id={user} & opponent_id={opponent} & winner_id={winner}

✅ `GET` /user/{user}/blockeds                       Get the blocked users for an user.
✅ `POST` /user/{user}/blocked                       Block an user for an user.
?blocked_id={id}
✅ `DELETE` /user/{user}/blocked                     Unblock an user for an user.
?unblocked_id={id}

`GET` /user/{user}/achievements						 Get user achievements
`POST` /user/{user}/achievements					 Add an achievement for an user.
`DELETE` /user/{user}/achievements					 Remove an achievement for an user.

`GET` /user/{user}/chat/{channel_id}/messages Get the messages for a channel (User should be member of it).
`POST` /user/{user}/chat/{channel_id}/messages Put a message from an user to a channel (User should be member of it).
?message={message}

`GET` /user/{user}/chat/channels Get all the channels the user is a member of.

`POST` /user/{user}/chat/channels Create a new channel for a user.

?title={title} & is_private={true/false} & password={password} & members={members}

`PATCH` /user/{user}/chat/{channel_id} Update channel information for a user (only if owner).
?title={new_title} & password={new_password}

`DELETE` /user/{user}/chat/{channel_id} Delete a channel for a user (only if owner).

`POST` /user/{user}/chat/{channel_id}/mute Mute a user in a channel (only if admin or owner).
?target_id={id} & mute_time={time}
`POST` /user/{user}/chat/{channel_id}/ban Ban a user from a channel (only if admin or owner).
?target_id={id} & ban_time={time}
`POST` /user/{user}/chat/{channel_id}/op Promote a user to admin in a channel (only if owner).
?target_id={id}

```-```