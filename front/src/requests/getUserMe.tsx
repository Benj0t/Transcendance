import axios from '../components/utils/axios';

interface getUserMeResponse {
  id: number;
  nickname: string;
  avatar_base64: string;
  two_factor_secret: string;
  two_factor_enable: boolean;
  user_42_id: number;
}

const getUserMe = async (): Promise<getUserMeResponse> => {
  const response = await axios.get<getUserMeResponse>(`http://localhost:8080/api/user/me`);
  return response.data;
};
export default getUserMe;
