import axios from '../components/utils/axios';

const patchUserName = async (name: string): Promise<any> => {
  const requestData = {
    nickname: name,
  };
  const response = await axios.patch(`/api/user/nickname`, requestData);

  return response.data;
};
export default patchUserName;
