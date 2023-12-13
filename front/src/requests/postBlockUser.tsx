import axios from '../components/utils/axios';

const blockUser = async (blockedid: number): Promise<any> => {
  const requestData = {
    params: {
      blocked_id: blockedid,
    },
  };

  const response = await axios.post(`/api/user/blockeds/`, requestData);

  return response.data;
};
export default blockUser; // untested
