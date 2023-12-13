import axios from '../components/utils/axios';

const deleteFriend = async (friendid: number): Promise<any> => {
  const requestData = {
    params: {
      friend_id: friendid,
    },
  };
  const response = await axios.delete(`/api/user/friends/`, requestData);
  return response.data;
};
export default deleteFriend;
