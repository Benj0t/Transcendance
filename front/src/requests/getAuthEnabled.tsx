import axios from 'axios';
import Cookies from 'js-cookie';

// Pass the string when Auth isnt done and you need to set the 2FA pass to log and set the JwtCookie
// Pass null if you have to get the jwt from Cookies
const AuthEnabled = async (jwt: string | null): Promise<boolean> => {
  const jwtCookie = jwt === null ? Cookies.get('jwt') : jwt;
  const authHeader = typeof jwtCookie === 'string' ? `Bearer ${jwtCookie}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
  };
  let data = false;
  await axios
    .get(`http://localhost:8080/api/auth/enabled/`, requestData)
    .then(function (response) {
      console.log(response.data);
      data = response.data;
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
  return data;
};
export default AuthEnabled;
