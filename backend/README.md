`API DOCUMENTATION`

```-```

✅ `GET` /auth/callback                              Authenticade an user with 42 API.
?code={code}

✅ `GET` /user/                                 		Get all users.
✅ `GET` /user/{id}                                  Get an user.
✅ `GET` /user/{user}/avatar                         Get the avatar for an user.
✅ `GET` /user/{user}/friends                        Get the friends for an user.
✅ `GET` /user/{user}/matches                        Get the matches for an user.
✅ `GET` /user/{user}/blockeds                       Get the blocked users for an user.
`GET` /user/{user}/chat/{channel_id}/messages        Get the messages for a channel (User should be member of it).

`POST` /user/{user}                                  Update user settings
?username={name} & color={color} & ...

✅ `POST` /user/{user}/avatar                        Update the avatar for an user
?avatar_base64={avatar_base64}

✅ `POST` /user/{user}/friends                       Add a friend for an user
?friend_id={friend}

✅ `DELETE` /user/{user}/friends                     Remove a friend for an user
?friend_id={friend}

✅ `POST` /user/{user}/blockeds                      Block an user for an user.
?blocked_id={id}

✅ `DELETE` /user/{user}/blockeds                    Unblock an user for an user.
?unblocked_id={id}

✅ `POST` /user/{user}/matches                       Add a match for an user
?user_id={user} & opponent_id={opponent} & winner_id={winner}

`POST` /user/{user}/chat/{channel_id}                Put a message from an user to a channel (User should be member of it).
?message={message}

```-```