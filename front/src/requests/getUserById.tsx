import axios from 'axios';
import Cookies from 'js-cookie';

const GetUserById = async (userid: number): Promise<any> => {
  let data = { error: '', loading: false, data: {} };

  const jwt = Cookies.get('jwt');
  const authHeader = typeof jwt === 'string' ? `Bearer ${jwt}` : '';
  const requestData = {
    headers: {
      Authorization: authHeader,
    },
  };

  await axios
    .get(`http://localhost:8080/api/user/${userid}/`, requestData)
    .then(function (response) {
      data = { error: '', loading: false, data: response.data };
    })
    .catch(function (error) {
      console.log(error);
    });

  return data;
};
export default GetUserById;
