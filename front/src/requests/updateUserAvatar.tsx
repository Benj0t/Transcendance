import axios from '../components/utils/axios';

const updateUserAvatar = async (avatarbase64: string): Promise<any> => {
  const requestData = {
    params: {
      avatar_base64: avatarbase64,
    },
  };

  const response = await axios.post(`user/avatar/`, requestData);

  return response.data;
};
export default updateUserAvatar; // untested
