import axios from '../components/utils/axios';

const AuthVerify = async (codeSent: string): Promise<any> => {
  const requestData = {
    params: {
      OTP: codeSent,
    },
  };


  const response = await axios.get(`/api/auth/verify/`, requestData);
  return response.data;
};
export default AuthVerify;
