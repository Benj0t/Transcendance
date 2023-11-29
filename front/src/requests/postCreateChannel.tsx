import axios from '../components/utils/axios';

const CreateChannel = async (
  channelName: string,
  channelPass: string,
  channelMembers: number[],
): Promise<any> => {
  const requestData = {
    title: channelName,
    password: channelPass,
    members: channelMembers,
  };
  const response = await axios.post(`http://localhost:8080/api/channels`, requestData);

  return response.data;
};
export default CreateChannel;
