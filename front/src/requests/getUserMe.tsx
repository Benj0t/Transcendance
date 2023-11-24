import axios from 'axios';
import Cookies from 'js-cookie';

interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

const getUserMe = async (): Promise<getUserMeResponse> => {
  const jwt = Cookies.get('jwt');
  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
  };

  const response = await axios.get<getUserMeResponse>(
    `http://localhost:8080/api/user/me`,
    requestData,
  );
  return response.data;
};
export default getUserMe;
