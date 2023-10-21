import React, { useEffect, useState } from 'react';
import { bake_cookie } from 'sfcookies';
import { useNavigate } from 'react-router';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>('');
  const handleAuthCallback = (): void => {
    const queryString = window.location.search;

    const jwtParam = new URLSearchParams(queryString).get('jwt');

    if (jwtParam != null) {
      bake_cookie('jwt', jwtParam);
      // Plus tard faut mettre le socket la.
      navigate('/');
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
