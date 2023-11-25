import axios from '../components/utils/axios';

const GetUsers = async (): Promise<any> => {
  const response = await axios.get(`http://localhost:8080/api/user`);

  return response.data;
};
export default GetUsers; // untested
