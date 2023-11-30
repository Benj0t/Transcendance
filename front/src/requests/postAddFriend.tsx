import axios from '../components/utils/axios';

const postAddFriend = async (friendid: number): Promise<any> => {
  const response = await axios.post(`user/friends?friend_id=${friendid}`);
  return response.data;
};
export default postAddFriend; // untested
