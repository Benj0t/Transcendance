import axios from '../components/utils/axios';

const UnblockUser = async (unblockedid: number): Promise<any> => {
  const requestData = {
    params: {
      unblocked_id: unblockedid,
    },
  };

  const response = await axios.delete(`/api/user/blockeds/`, requestData);
  return response.data;
};
export default UnblockUser; // untested
