**API DOCUMENTATION**
---

**Authentication**

✅ **Authenticate an User with 42 API**

> `Endpoint`: `GET /auth/callback`
> 
> `Parameters`: 
> 
> `code`: Authentication code
> 
> `Access`: Any user
> 
> `Returns`: Authentication token or error message

---

**Users**

✅ **Get All Users**

> `Endpoint`: `GET /user`
> 
> `Parameters`: None
> 
> `Access`: Admin
> 
> `Returns`: List of all users

✅ **Get an User**

> `Endpoint`: `GET /user/{id}`
> 
> `Parameters`: None
> 
> `Access`: Any authenticated user or admin
> 
> `Returns`: User details or error message

🔵 **Update User Settings**

> `Endpoint`: `POST /user/{user}`
> 
> `Parameters`: 
> 
> `username`: New username
> 
> `color`: New color
> 
> ...
> 
> `Access`: User himself/herself
> 
> `Returns`: Success or error message

✅ **Get the Avatar for an User**

> `Endpoint`: `GET /user/{user}/avatar`
> 
> `Parameters`: None
> 
> `Access`: Any authenticated user or admin
> 
> `Returns`: Avatar image or error message

1️⃣ **Update the Avatar for an User**

> `Endpoint`: `POST /user/{user}/avatar`
> 
> `Parameters`: 
> 
> `avatar_base64`: New avatar in base64
> 
> `Access`: User himself/herself
> 
> `Returns`: Success or error message

---

**Friends**

✅ **Get the Friends for an User**

> `Endpoint`: `GET /user/{user}/friends`
> 
> `Parameters`: None
> 
> `Access`: User himself/herself or admin
> 
> `Returns`: List of friends or error message

✅ **Add a Friend for an User**

> `Endpoint`: `POST /user/{user}/friend`
> 
> `Parameters`: 
> 
> `friend_id`: ID of the friend to add
> 
> `Access`: User himself/herself
> 
> `Returns`: Success or error message

✅ **Remove a Friend for an User**

> `Endpoint`: `DELETE /user/{user}/friend`
> 
> `Parameters`: 
> 
> `friend_id`: ID of the friend to remove
> 
> `Access`: User himself/herself
> 
> `Returns`: Success or error message

---

**Matches**

✅ **Get the Matches for an User**

> `Endpoint`: `GET /user/{user}/matches`
> 
> `Parameters`: None
> 
> `Access`: User himself/herself or admin
> 
> `Returns`: List of matches or error message

✅ **Add a Match for an User**

> `Endpoint`: `POST /user/{user}/match`
> 
> `Parameters`: 
> 
> `user_id`: ID of the user
> 
> `opponent_id`: ID of the opponent
> 
> `winner_id`: ID of the winner
> 
> `Access`: User himself/herself
> 
> `Returns`: Success or error message

---

**Blocked Users**

✅ **Get the Blocked Users for an User**

> `Endpoint`: `GET /user/{user}/blockeds`
> 
> `Parameters`: None
> 
> `Access`: User himself/herself or admin
> 
> `Returns`: List of blocked users or error message

✅ **Block an User**

> `Endpoint`: `POST /user/{user}/blocked`
> 
> `Parameters`: 
> 
> `blocked_id`: ID of the user to block
> 
> `Access`: User himself/herself
> 
> `Returns`: Success or error message

✅ **Unblock an User**

> `Endpoint`: `DELETE /user/{user}/blocked`
> 
> `Parameters`: 
> 
> `unblocked_id`: ID of the user to unblock
> 
> `Access`: User himself/herself
> 
> `Returns`: Success or error message

---

**Achievements**

🔵 **Get User Achievements**

> `Endpoint`: `GET /user/{user}/achievements`
> 
> `Parameters`: None
> 
> `Access`: User himself/herself or admin
> 
> `Returns`: List of achievements or error message

🔵 **Add an Achievement for an User**

> `Endpoint`: `POST /user/{user}/achievements`
> 
> `Parameters`: 
> 
> (Specify the required parameters here)
> 
> `Access`: User himself/herself or admin
> 
> `Returns`: Success or error message

**Channels**

🔵 **Create a New Channel**

> `Endpoint`: `POST` /api/channels
> 
> `Parameters`:
> 
> `title`: Title of the channel
> 
> `password`: Password for the channel (optional)
> 
> `members`: Array of member IDs
> 
> `Access`: Any authenticated user
> 
> `Returns`: Channel ID or error message

🔵 **Get All User's Channels**

> `Endpoint`: `GET` /user/{user}/channels
> 
> `Parameters`: None
> 
> `Access`: User himself/herself or admin
> 
> `Returns`: List of channels the user is a member of
>

🔵 **Delete a Channel**

> `Endpoint`: `DELETE` /api/channels/{channel_id}
> 
> `Parameters`: None
> 
> `Access`: Channel owner only
> 
> `Returns`: Success or error message

🔵 **Update Channel Information**

> `Endpoint`: `PATCH` /api/channels/{channel_id}
> 
> `Parameters`:
> 
> `title`: New title of the channel
> 
> `password`: New password for the channel
> 
> `Access`: Channel owner only
> 
> `Returns`: Success or error message

**Messages**

🔵 **Get Channel Messages**

> `Endpoint`: `GET` /api/channels/{channel_id}/messages
> 
> `Parameters`: None
> 
> `Access`: Members of the channel
> 
> `Returns`: List of messages

🔵 **Post a Message to Channel**

> `Endpoint`: `POST` /api/channels/{channel_id}/messages
> 
> `Parameters`:
> 
> `message`: Text of the message
> 
> `Access`: Members of the channel
> 
> `Returns`: Message ID or error message

**Administrative Actions**

🔵 **Mute a User in a Channel**

> `Endpoint`: `POST` /api/channels/{channel_id}/mute
> 
> `Parameters`:
> 
> `target_id`: ID of the user to mute
> 
> `mute_time`: Time duration for muting
> 
> `Access`: Channel admins or owner
> 
> `Returns`: Success or error message
> 
🔵 **Ban a User from a Channel**

> `Endpoint`: `POST` /api/channels/{channel_id}/ban
> 
> `Parameters`:
> 
> `target_id`: ID of the user to ban
> 
> `ban_time`: Time duration for the ban
> 
> `Access`: Channel admins or owner
> 
> `Returns`: Success or error message

🔵 **Promote a User to Admin in a Channel**

> `Endpoint`: `POST` /api/channels/{channel_id}/op
> 
> `Parameters`:
> 
> `target_id`: ID of the user to promote
> 
> `Access`: Channel owner only
> 
> `Returns`: Success or error message

**Direct Messages**

🔵 **Create or Retrieve Direct Message Channel**

> `Endpoint`: `POST` /api/channels/dm
> 
> `Parameters`:
> 
> `user1`: ID of the first user
> 
> `user2`: ID of the second user
> 
> `Access`: Either of the two users
> 
> `Returns`: Channel ID or error message

---

`POST` /api/channels ✅	-->createChannel
`GET` /user/{user}/channels ✅	--> getUserChannels
`DELETE` /api/channels/{channel_id} ✅	--> deleteChannel
`PATCH` /api/channels/{channel_id}
`GET` /api/channels/{channel_id}/messages	--> getMessages
`POST` /api/channels/{channel_id}/messages ✅	--> sendMessage
`POST` /api/channels/{channel_id}/mute ✅	--> muteUser
`DELETE` /api/channels/{channel_id}/mute ✅	--> unmuteUser
`POST` /api/channels/{channel_id}/kick ✅	--> kickUser
`POST` /api/channels/{channel_id}/ban ✅	--> banUser
`DELETE` /api/channels/{channel_id}/ban ✅	--> pardonUser
`POST` /api/channels/{channel_id}/op ✅	--> opUser
`DELETE` /api/channels/{channel_id}/op ✅	--> deopUser
`POST` /api/channels/dm