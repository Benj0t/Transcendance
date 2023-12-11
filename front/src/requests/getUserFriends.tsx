import axios from '../components/utils/axios';

export interface getUserFriendsRequest {
  id: number;
  user_id: number;
  friend_id: number;
}

const getUserFriends = async (): Promise<getUserFriendsRequest[]> => {
  const response = await axios.get<getUserFriendsRequest[]>(`user/friends/`);
  return response.data;
};

export default getUserFriends;
