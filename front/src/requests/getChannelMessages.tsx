import axios from '../components/utils/axios';

interface channelMessagesResponse {
  channel_id: number;
  user_id: number;
  message: string;
  created_at: Date;
}

const getChannelMessages = async (channelId: number): Promise<channelMessagesResponse[]> => {
  const response = await axios.get(`channels/${channelId}/messages`);

  return response.data;
};
export default getChannelMessages;