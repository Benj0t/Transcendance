import axios from '../components/utils/axios';

const getUserBlockedUsers = async (): Promise<any> => {
  const response = await axios.get(`/api/user/blockeds`);
  return response.data;
};
export default getUserBlockedUsers;
