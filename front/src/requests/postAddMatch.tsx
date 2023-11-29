import axios from '../components/utils/axios';

const postAddMatch = async (winnerid: number, opponentid: number): Promise<any> => {
  const requestData = {
    opponent_id: opponentid,
    winner_id: winnerid,
  };

  const response = await axios.post(`http://localhost:8080/api/user/matches/`, requestData);

  return response.data;
};
export default postAddMatch; // untested
