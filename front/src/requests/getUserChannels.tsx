import axios from '../components/utils/axios';

const getUserChannels = async (): Promise<any> => {
  const response = await axios.get(`user/channels/`);

  return response.data;
};
export default getUserChannels;
