import axios from 'axios';
import Cookies from 'js-cookie';

const AuthGenerate = async (): Promise<string> => {
  const jwt = Cookies.get('jwt');
  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
  };
  try {
    const response = await axios.post(`http://localhost:8080/api/auth/generate/`, requestData);
    const responseData = encodeURIComponent(response.data);
    return responseData;
  } catch (error) {
    console.error('Request Error: ', error);
    return '';
  }
};
export default AuthGenerate;
