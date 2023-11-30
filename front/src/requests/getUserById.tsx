import axios from '../components/utils/axios';

const GetUserById = async (userid: number): Promise<any> => {
  const response = await axios.get(`user/${userid}/`);

  return response.data;
};
export default GetUserById;
