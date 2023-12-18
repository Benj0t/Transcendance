import axios from '../components/utils/axios';

const blockUser = async (blockedid: number): Promise<any> => {
  const response = await axios.post(`/api/user/blockeds?blocked_id=${blockedid}`);

  return response.data;
};
export default blockUser; // untested
