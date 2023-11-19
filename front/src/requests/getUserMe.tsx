import axios from 'axios';
import Cookies from 'js-cookie';

// Pass the string when Auth isnt done and you need to set the 2FA pass to log and set the JwtCookie
// Pass null if you have to get the jwt from Cookies
const GetUserMe = async (): Promise<any> => {
  let data = { error: '', loading: false, data: {} };

  const jwt = Cookies.get('jwt');
  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
  };

  await axios
    .get(`http://localhost:8080/api/user/me/`, requestData)
    .then(function (response) {
      data = { error: '', loading: false, data: response.data };
    })
    .catch(function (error) {
      console.log(error);
    });

  return data;
};
export default GetUserMe;
