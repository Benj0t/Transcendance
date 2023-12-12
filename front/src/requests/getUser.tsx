import axios from '../components/utils/axios';

const getUsers = async (): Promise<any> => {
  const response = await axios.get(`/api/user`);

  return response.data;
};
export default getUsers; // untested
