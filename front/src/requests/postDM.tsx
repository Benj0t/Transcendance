import axios from '../components/utils/axios';

const postDM = async (sendID: number, message: string): Promise<any> => {
  const requestData = {
    recipient_id: sendID,
    message,
  };

  const response = await axios.post(`/api/channels/dm`, requestData);

  return response.data;
};

export default postDM;
