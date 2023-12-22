import axios from '../components/utils/axios';

const deleteChannel = async (channelID: number): Promise<any> => {
  const response = await axios.delete(`/api/channels/${channelID}`);
  return response.data;
};
export default deleteChannel;
