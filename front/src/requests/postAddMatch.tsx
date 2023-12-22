import axios from '../components/utils/axios';

const postAddMatch = async (
  winnerid: number,
  opponentid: number,
  scoreuser1: number,
  scoreuser2: number,
  matchduration: number,
): Promise<any> => {
  const requestData = {
    theopponent: opponentid,
    winner_id: winnerid,
    score_user_1: scoreuser1,
    score_user_2: scoreuser2,
    match_duration: matchduration,
  };
  const response = await axios.post(`/api/user/matches/`, requestData);
  return response.data;
};
export default postAddMatch;
