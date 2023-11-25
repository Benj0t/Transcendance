import axios from '../components/utils/axios';

const GetUserMatches = async (userID: number): Promise<any> => {
  const requestData = {
    params: {
      id: userID,
    },
  };
  const response = await axios.get(`http://localhost:8080/api/user/matches/`, requestData);
  return response.data;
};
export default GetUserMatches; // untested
