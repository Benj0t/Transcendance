import axios from '../components/utils/axios';
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
  const response = await axios.get(`/api/auth/enabled/`, requestData);
  return response.data;
};
export default AuthEnabled;
