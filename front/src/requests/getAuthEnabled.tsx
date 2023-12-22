import axios from '../components/utils/axios';
import Cookies from 'js-cookie';

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
