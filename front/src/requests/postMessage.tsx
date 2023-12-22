import axios from '../components/utils/axios';

const postMessage = async (channelId: number, message: string): Promise<any> => {
  const requestData = {
    message,
  };

  const response = await axios.post(`/api/channels/${channelId}/messages`, requestData);

  return response.data;
};

export default postMessage;
