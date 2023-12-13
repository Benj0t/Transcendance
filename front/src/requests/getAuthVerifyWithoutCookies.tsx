import axios from '../components/utils/axios';

const AuthVerifyWithoutCookie = async (codeSent: string, jwt: string | null): Promise<any> => {
  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
    params: {
      OTP: codeSent,
    },
  };

  const response = await axios.get(`/api/auth/verify/`, requestData);

  return response.data;
};
export default AuthVerifyWithoutCookie;
