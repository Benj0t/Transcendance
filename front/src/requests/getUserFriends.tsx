import axios from 'axios';
import Cookies from 'js-cookie';

export interface getUserFriendsRequest {
  id: number;
  userId: number;
  friendId: number;
}

const getUserFriends = async (): Promise<getUserFriendsRequest[]> => {
  const jwt = Cookies.get('jwt');
  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
  };
  const response = await axios.get<getUserFriendsRequest[]>(
    `http://localhost:8080/api/user/friends/`,
    requestData,
  );
  return response.data;
};

export default getUserFriends;
