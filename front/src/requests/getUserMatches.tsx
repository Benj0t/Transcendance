import axios from '../components/utils/axios';

const GetUserMatches = async (userID: number): Promise<any> => {
  const requestData = {
    params: {
      id: userID,
    },
  };
  const response = await axios.get(`/api/user/matches/`, requestData);
  return response.data;
};
export default GetUserMatches; // untested
