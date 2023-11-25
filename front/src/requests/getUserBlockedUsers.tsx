import axios from '../components/utils/axios';

const GetUserBlockedUsers = async (): Promise<any> => {
  const response = await axios.get(`http://localhost:8080/api/user/blockeds/`);

  return response.data;
};
export default GetUserBlockedUsers;
