import axios from '../components/utils/axios';

const postLeaveChannel = async (channelId: number): Promise<any> => {
  const response = await axios.post(`/api/channels/${channelId}/leave`);

  return response.data;
};
export default postLeaveChannel;
