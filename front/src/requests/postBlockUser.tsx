import axios from 'axios';
import Cookies from 'js-cookie';

const blockUser = async (blockedid: number): Promise<any> => {
  let data = { error: '', loading: false, data: {} };
  const userid = 1;

  const jwt = Cookies.get('jwt');
  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
    params: {
      blocked_id: blockedid,
    },
  };

  await axios
    .post(`http://localhost:8080/api/user/${userid}/blockeds/`, requestData)
    .then(function (response) {
      data = { error: '', loading: false, data: response.data };
    })
    .catch(function (error) {
      console.log(error);
    });

  return data;
};
export default blockUser; // untested
