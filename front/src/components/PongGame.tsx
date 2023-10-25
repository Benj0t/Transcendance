import React, { useEffect, useRef, useState } from 'react';
import './styles/PongGame.css';
import Area from './utils/Area';
import io from 'socket.io-client';

const PongGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socket = io('http://localhost:8001');
  const [racketY, setRacketY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;

    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    const area = new Area(canvas.width, canvas.height, 1, 2);
    console.log('Canvas Width:', canvas.width);
    console.log('Canvas Height:', canvas.height);

    const handleMouseMove = (e: MouseEvent): void => {
      const canvasRect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - canvasRect.top;
      const maxY = canvas.height - area.racketSize().getHeight();

      // Assurez-vous que la position Y est dans les limites du canvas
      const newRacketY = Math.min(maxY, Math.max(0, mouseY));

      setRacketY(newRacketY);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    // Fonction de dessin
    const draw = (): void => {
      // Effacer le contenu du canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner une ligne noire autour du canvas pour la bordure
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      // Dessiner le milieu du terrain (ligne au milieu)
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      const player = area.getPlayer();
      const opponent = area.getOpponent();
      const ballEntity = area.getBall();
      const racketSize = area.racketSize();
      const ballSize = area.ballSize();

      // Log des valeurs de la raquette du joueur
      console.log('Player Y:', player.getLocation().getY());
      console.log('Player X:', player.getLocation().getX());
      console.log('Racket Width:', racketSize.getWidth());
      console.log('Racket Height:', racketSize.getHeight());

      // Log des valeurs de la raquette de l'opposant
      console.log('Opponent Y:', opponent.getLocation().getY());
      console.log('Opponent X:', opponent.getLocation().getX());

      // Log des valeurs de la balle
      console.log('Ball Y:', ballEntity.getLocation().getY());
      console.log('Ball X:', ballEntity.getLocation().getX());
      console.log('Ball Width:', ballSize.getWidth());

      // Dessiner les raquettes et la balle en utilisant les données de Area
      ctx.fillRect(
        player.getLocation().getX(),
        racketY,
        racketSize.getWidth(),
        racketSize.getHeight(),
      );

      ctx.fillRect(
        opponent.getLocation().getX() - racketSize.getWidth(),
        opponent.getLocation().getY(),
        racketSize.getWidth(),
        racketSize.getHeight(),
      );
      // if (opponentRacketPosition !== null) {
      //   const opponentY = (canvas.height * opponentRacketPosition) / 100;
      //   ctx.fillRect(canvas.width - racketSize.getWidth(), opponentY, racketSize.getWidth(), racketSize.getHeight());
      // }

      ctx.beginPath();
      ctx.arc(
        ballEntity.getLocation().getX(),
        ballEntity.getLocation().getY(),
        ballSize.getWidth() / 2,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = 'black'; // Couleur de la balle
      ctx.fill();

      // Envoyer la position de la raquette au serveur
      // if (socket) {
      //   socket.emit('racketMovement', racketY);
      // }

      requestAnimationFrame(draw);
    };

    // Appeler la fonction de dessin
    draw();

    // Envoyer périodiquement un paquet au serveur
    // const sendKeepAlivePacket = (): void => {
    // if (socket) {
    // Ici, vous pouvez envoyer un paquet indiquant que le client est toujours connecté
    // et inclure la position de la raquette
    // socket.emit('keep_alive_packet', { racketY });
    // }
    // };

    // const keepAliveInterval = setInterval(sendKeepAlivePacket, 50); // Envoyer toutes les 50 ms

    return () => {
      // if (socket) {
      //   socket.disconnect();
      // }
      canvas.removeEventListener('mousemove', handleMouseMove); // Supprimer l'écouteur d'événements
    };
  }, [socket, racketY]);

  return (
    <div>
      <div className="centered-container">
        <div className="score">player1------playerScore - opponentScore-----opponentID</div>
        <canvas ref={canvasRef} width={800} height={400} />
      </div>
    </div>
  );
};

export default PongGame;
