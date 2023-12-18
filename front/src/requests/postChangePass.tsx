import axios from '../components/utils/axios';

const changePass = async (channelId: number, channelPass: string): Promise<any> => {
  const requestData = {
    password: channelPass,
  };
  const response = await axios.post(`/api/channels/${channelId}/password`, requestData);

  return response.data;
};
export default changePass;
