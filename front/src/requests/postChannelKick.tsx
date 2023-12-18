import axios from '../components/utils/axios';

const postChannelKick = async (
  channelID: number,
  adminID: number,
  target: number,
): Promise<any> => {
  const requestData = {
    moderatorId: adminID,
    targetId: target,
  };
  const response = await axios.post(`/api/channels/${channelID}/kick`, requestData);

  return response.data;
};
export default postChannelKick;
