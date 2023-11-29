import axios from '../components/utils/axios';

const joinChannel = async (channelId: string, channelPass: string): Promise<any> => {
  const requestData = {
    password: channelPass,
  };
  const response = await axios.post(
    `http://localhost:8080/api/channels/${channelId}/join`,
    requestData,
  );

  return response.data;
};
export default joinChannel;
