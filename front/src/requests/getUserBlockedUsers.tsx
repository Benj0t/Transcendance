import axios from '../components/utils/axios';

const GetUserBlockedUsers = async (): Promise<any> => {

  const response = await axios.get(`/api/user/blockeds/`);
  return response.data;
};
export default GetUserBlockedUsers;
