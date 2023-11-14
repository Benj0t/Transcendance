import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleAuthCallback = (): void => {
    const queryString = window.location.search;
    const jwtParam = new URLSearchParams(queryString).get('jwt');

    if (jwtParam != null) {
      Cookies.set('jwt', jwtParam);
      navigate('/authTwoFactor');
    } else {
      setError('JWT non trouvé dans la réponse.');
    }
  };
  useEffect(() => {
    handleAuthCallback();
  }, []);
  if (error !== '') return <div>{error}</div>;
  return <div>AuthCallback Page</div>;
};

export default AuthCallback;
