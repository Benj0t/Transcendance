import axios from '../components/utils/axios';

const postChannelMute = async (
  channelID: number,
  adminID: number,
  target: number,
  time: number,
): Promise<any> => {
  const requestData = {
    moderatorId: adminID,
    targetId: target,
    muteTime: time,
  };
  const response = await axios.post(`/api/channels/${channelID}/mute`, requestData);

  return response.data;
};
export default postChannelMute;
