import axios from '../components/utils/axios';

const GetUserAvatar = async (): Promise<any> => {
  const response = await axios.get(`user/avatar/`);

  return response.data;
};
export default GetUserAvatar; // untested
