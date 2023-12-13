import axios from '../components/utils/axios';

interface channelMessagesResponse {
  channel_id: number;
  user_id: number;
  message: string;
  created_at: Date;
}

const postMessage = async (
  channelId: number,
  message: string,
): Promise<channelMessagesResponse[]> => {
  const requestData = {
    message,
  };

  const response = await axios.post(`/api/channels/${channelId}/messages`, requestData);

  return response.data;
};

export default postMessage;
