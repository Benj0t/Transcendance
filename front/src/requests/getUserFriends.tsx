import axios from '../components/utils/axios';

export interface getUserFriendsRequest {
  id: number;
  userId: number;
  friendId: number;
}

const getUserFriends = async (): Promise<getUserFriendsRequest[]> => {
  const response = await axios.get<getUserFriendsRequest[]>(
    `http://localhost:8080/api/user/friends/`,
  );
  return response.data;
};

export default getUserFriends;
