import axios from '../components/utils/axios';

const AuthGenerate = async (): Promise<string> => {
  try {
    const response = await axios.post(`/api/auth/generate/`);
    const responseData = encodeURIComponent(response.data);
    return responseData;
  } catch (error) {
    console.error('Request Error: ', error);
    return '';
  }
};
export default AuthGenerate;
