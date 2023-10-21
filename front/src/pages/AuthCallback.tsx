import React, { useEffect, useState } from 'react';
import { bake_cookie } from 'sfcookies';
import { useNavigate } from 'react-router';
import { pongSocket } from '../components/pongSocket';
import { PacketOutTime } from '../../../backend/src/pong/packet/time.packet';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string>('');
  const handleAuthCallback = (): void => {
    const queryString = window.location.search;

    const jwtParam = new URLSearchParams(queryString).get('jwt');

    if (jwtParam != null) {
      bake_cookie('jwt', jwtParam);

      useEffect(() => {
        pongSocket?.on('time_packet', packetOutTime => {
          console.log('test');
        });
      });

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
function Connected(...args: any[]): void {
  throw new Error('Function not implemented.');
}

