import axios from '../components/utils/axios';

const AddFriend = async (friendid: number): Promise<any> => {
  const requestData = {
    params: {
      friend_id: friendid,
    },
  };
  const response = await axios.delete(`http://localhost:8080/api/user/friends/`, requestData);
  return response.data;
};
export default AddFriend; // untested
