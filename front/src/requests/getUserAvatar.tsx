import axios from '../components/utils/axios';

const GetUserAvatar = async (): Promise<any> => {
  const response = await axios.get(`http://localhost:8080/api/user/avatar/`);

  return response.data;
};
export default GetUserAvatar; // untested
