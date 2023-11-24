import axios from 'axios';
import Cookies from 'js-cookie';

const CreateChannel = async (
  channelName: string,
  channelPass: string,
  channelMembers: number[],
): Promise<any> => {
  let data = { error: '', loading: false, data: {} };

  const jwt = Cookies.get('jwt');
  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
    params: {
      title: channelName,
      password: channelPass,
      members: channelMembers,
    },
  };

  await axios
    .post(`http://localhost:8080/api/channel/`, requestData)
    .then(function (response) {
      data = { error: '', loading: false, data: response.data };
    })
    .catch(function (error) {
      console.log(error);
    });

  return data;
};
export default CreateChannel; // untested
