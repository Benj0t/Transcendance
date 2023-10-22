import React, { useEffect } from 'react';
import { bake_cookie } from 'sfcookies';
// import { pongSocket } from '../components/pongSocket';
import { useNavigate } from 'react-router';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  // const [error, setError] = useState<string>('');

  const handleAuthCallback = (): void => {
    // const queryString = window.location.search;
    console.log('COUCOU');
    // const jwtParam = new URLSearchParams(queryString).get('jwt');
    bake_cookie('userIsAuth', 'true');

    // if (jwtParam != null) {
    //   bake_cookie('jwt', jwtParam);
    navigate('/');
    // } else {
    //   setError('JWT non trouvé dans la réponse.');
    // }
  };
  useEffect(() => {
    handleAuthCallback();
  }, []);
  // if (error !== '') return <div>{error}</div>;
  return <div>AuthCallback Page</div>;
};

export default AuthCallback;
