import axios from '../components/utils/axios';

const postAddFriend = async (friendid: number): Promise<any> => {
  const requestData = {
    params: {
      friend_id: friendid,
    },
  };
  const response = await axios.post(`http://localhost:8080/api/user/friends/`, requestData);
  return response.data;
};
export default postAddFriend; // untested
