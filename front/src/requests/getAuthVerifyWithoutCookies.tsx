import axios from 'axios';

const AuthVerifyWithoutCookie = async (codeSent: string, jwt: string | null): Promise<any> => {
  let data = { error: '', loading: false, data: {} };

  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
    params: {
      OTP: codeSent,
    },
  };

  await axios
    .get(`http://localhost:8080/api/auth/verify/`, requestData)
    .then(function (response) {
      data = { error: '', loading: false, data: response.data };
    })
    .catch(function (error) {
      console.log(error);
    });

  return data;
};
export default AuthVerifyWithoutCookie;
