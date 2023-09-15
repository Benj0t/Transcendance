import React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // const [token, setToken] = useState();

  const onClick = (): void => {
    axios
      .request({
        url: 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2c8d9db03c47fbff2b0498581e3badfacdf6e8a94f08c3c7338c2c5e27bb7f81&redirect_uri=http://localhost:8080/api/auth/callback&response_type=code&scope=public&state=a_very_long_random_string_witchmust_be_unguessable',
        method: 'get',
      })
      .then((response) => {
        console.log(response);
        navigate('/');
      })
      .catch((e) => {
        console.log(e);
        return <p>Auth failed</p>;
      });
  };

  return (
    <div
      style={{
        margin: 0,
        position: 'absolute',
        left: '40%',
        top: '50%',
      }}
    >
      <Button variant="contained" onClick={onClick}>
        Login With 42API
      </Button>
    </div>
  );
};
export default LoginPage;
