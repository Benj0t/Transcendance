import axios from '../components/utils/axios';

interface channelUsersResponse {
  channel_id: number;
  user_id: number;
  role: number;
  mute_expiry_at?: Date;
}
const getChannelUsers = async (channelId: number): Promise<channelUsersResponse[]> => {
  const response = await axios.get(`/api/channels/${channelId}/members`);

  return response.data;
};
export default getChannelUsers;