import axios from '../components/utils/axios';

const postChannelOp = async (
  channelID: number,
  ownerID: number,
  newAdmin: number,
): Promise<any> => {
  const requestData = {
    ownerId: ownerID,
    targetId: newAdmin,
  };
  const response = await axios.post(`/api/channels/${channelID}/op`, requestData);

  return response.data;
};
export default postChannelOp;
