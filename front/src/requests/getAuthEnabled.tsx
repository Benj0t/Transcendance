import axios from 'axios';
import Cookies from 'js-cookie';

const AuthEnabled = async (): Promise<boolean> => {
  const jwt = Cookies.get('jwt');
  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
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
      data =  response.data;
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
  return data;
};
export default AuthEnabled;
