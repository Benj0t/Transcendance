import axios from '../components/utils/axios';

const postChannelBan = async (
  channelID: number,
  adminID: number,
  target: number,
  time: number,
): Promise<any> => {
  const requestData = {
    moderatorId: adminID,
    targetId: target,
    banTime: time,
  };
  const response = await axios.post(`/api/channels/${channelID}/ban`, requestData);

  return response.data;
};
export default postChannelBan;
