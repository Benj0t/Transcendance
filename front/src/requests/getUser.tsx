import axios from '../components/utils/axios';

const GetUsers = async (): Promise<any> => {
  const response = await axios.get(`user`);

  return response.data;
};
export default GetUsers; // untested
