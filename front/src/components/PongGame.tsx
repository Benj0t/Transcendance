import React, { useEffect, useRef, useState } from 'react';
import './styles/PongGame.css';
import Area from './utils/Area';
import io from 'socket.io-client';

const PongGame: React.FC = (): any => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socket = io('http://localhost:8001');
  const [racketY, setRacketY] = useState(0);
  const [isChoosingMatchmaking, setIsChoosingMatchmaking] = useState(false);
  const [isChoosingDuel, setIsChoosingDuel] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [opponentId, setOpponentId] = useState<number | null>(null);

  const sendMatchmakingPacket = (): any => {
    socket.emit("DualPacket", 0);
    setGameStarted(true);
    console.log('Player Y: caca');
  };
  
  const sendDualPacket = (opponentId: number): any => {
    socket.emit("DualPacket", opponentId);
    setIsChoosingDuel(true);
    setGameStarted(true);
    console.log('Player Y pipi');
  };

  const sendKeepAlivePacket = (racketY: number): any => {
    socket.emit("KeeplAlive", racketY);
    console.log('Player Y: popo');
  };

  // const sendDualPacket = (): any => {
  // };

  // const setIdle = (): any => {
  //   setGameWindow(null);
  // };

  // const setPlaying = (): any => {
  // };
  
  
  useEffect(() => {

    const canvas = canvasRef.current;
    if (canvas == null)
      return ;
  
    const ctx = canvas.getContext('2d');
    if (ctx == null)
      return ;
  
    const area = new Area(canvas.width, canvas.height, 1, 2);
    console.log('Canvas Width:', canvas.width);
    console.log('Canvas Height:', canvas.height);

    const handleMouseMove = (e: MouseEvent): void => {
      const canvasRect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - canvasRect.top;
      const maxY = canvas.height - area.racketSize().getHeight();
      const newRacketY = Math.min(maxY, Math.max(0, mouseY));

      setRacketY(newRacketY);
      sendKeepAlivePacket(racketY);
    };

    const draw = (): void => {
      if (isGameStarted)
      {
        if (isChoosingMatchmaking) {
          sendMatchmakingPacket();
        }
        else if (isChoosingDuel) {
          const opponentId = 123;
          sendDualPacket(opponentId);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
          
        // Dessiner un rectangle blanc qui remplit le canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';

        // Dessiner une ligne noire autour du canvas pour la bordure
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Dessiner le milieu du terrain (ligne au milieu)
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();

        const opponent = area.getOpponent();
        const ballEntity = area.getBall();
        const racketSize = area.racketSize();
        const ballSize = area.ballSize();

        // Espacement des raquettes par rapport aux bords
        const offsetFromEdge = 10;

        // Dessiner les raquettes et la balle en utilisant les données de Area
        ctx.fillRect(offsetFromEdge, racketY, racketSize.getWidth(), racketSize.getHeight());

        ctx.fillRect(
          canvas.width - racketSize.getWidth() - offsetFromEdge,
          opponent.getLocation().getY(),
          racketSize.getWidth(),
          racketSize.getHeight(),
        );

        // Dessiner le score
        ctx.font = '42px Arial';
        ctx.textAlign = 'center';

        const scoreY = 40; // Position verticale commune pour les scores

        ctx.fillText(`0`, canvas.width / 3, scoreY); // Score du joueur
        ctx.fillText(`0`, (2 * canvas.width) / 3, scoreY); // Score de l'adversaire

        ctx.beginPath();
        ctx.arc(
          ballEntity.getLocation().getX(),
          ballEntity.getLocation().getY(),
          ballSize.getWidth() / 2,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = 'white';
        ctx.fill();

        if (canvas != null)
          sendKeepAlivePacket(racketY);
        requestAnimationFrame(draw);
      }
    };

    draw();

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [socket, racketY, isGameStarted]);

  return (
    <div>
      <div className="centered-container">
        {isGameStarted ? (
          <canvas ref={canvasRef} width={800} height={400} />
        ) : (
          <div>
            {isChoosingMatchmaking ? (
              <button onClick={sendMatchmakingPacket}>Start Matchmaking</button>
            ) : isChoosingDuel ? (
              <div>
                <input
                  type="text"
                  placeholder="Enter Opponent ID"
                  value={opponentId !== null ? opponentId.toString() : ''}
                  onChange={(e): any => { setOpponentId(parseInt(e.target.value))} }
                />
                <button onClick={(): void => { 
                  if (opponentId !== null) {
                    sendDualPacket(opponentId);
                  } else {
                    console.log('Entrez d\'abord l\'ID de l\'opposant.');
                  }
                }}>Start Duel</button>
              </div>
            ) : (
              <div>
                <button onClick={(): void => { setIsChoosingMatchmaking(true)} }>Matchmaking</button>
                <button onClick={(): void => { setIsChoosingDuel(true)} }>Duel</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PongGame;

// import React, { useEffect, useRef, useState } from 'react';
// import './styles/PongGame.css';
// import Area from './utils/Area';
// import io from 'socket.io-client';
// import Entity from './utils/Entity'; // Import de la classe Entity
// import Racket from './utils/Racket'; // Assurez-vous que le chemin est correct
// import Size from './utils/Size'; // Assurez-vous que le chemin est correct
// import { NumbersRounded } from '@mui/icons-material';

// // ... (le reste de votre code)

// const PongGame: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const socket = io('http://localhost:8001');
//   const [racketY, setRacketY] = useState(0);

//   const area = useRef<Area | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     area.current = new Area(canvas.width, canvas.height, 1, 2);
//     console.log('Canvas Width:', canvas.width);
//     console.log('Canvas Height:', canvas.height);

//     const handleMouseMove = (e: MouseEvent): void => {
//       const canvasRect = canvas.getBoundingClientRect();
//       const mouseY = e.clientY - canvasRect.top;
//       const maxY = canvas.height - (area.current?.racketSize() || { getHeight: () => 0 }).getHeight();

//       // Make sure the Y position is within the canvas boundaries
//       const newRacketY = Math.min(maxY, Math.max(0, mouseY));

//       setRacketY(newRacketY);
//     };

//     canvas.addEventListener('mousemove', handleMouseMove);

//     // Drawing function
//     const draw = (): void => {
//       if (!area.current) return;

//       const player = area.current.getPlayer();
//       const opponent = area.current.getOpponent();
//       const ballEntity2 = new BallEntity(area.current.getSize());
//       const ballEntity = area.current.getBall();
//       const racketSize = area.current.racketSize();
//       const ballSize = area.current.ballSize();
//       ballEntity2.setX();
//       ballEntity2.setY();

//       // Clear the canvas content
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       // Draw a white rectangle that fills the canvas
//       ctx.fillStyle = 'black';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//       ctx.fillStyle = 'white';

//       // Draw a black line around the canvas for the border
//       ctx.strokeStyle = 'white';
//       ctx.lineWidth = 1;
//       ctx.strokeRect(0, 0, canvas.width, canvas.height);

//       // Draw the middle of the field (line in the middle)
//       ctx.beginPath();
//       ctx.moveTo(canvas.width / 2, 0);
//       ctx.lineTo(canvas.width / 2, canvas.height);
//       ctx.stroke();

//       // Offset of the rackets from the edges
//       const offsetFromEdge = 10;

//       // Draw the rackets
//       ctx.fillRect(offsetFromEdge, racketY, racketSize.getWidth(), racketSize.getHeight());

//       ctx.fillRect(
//         canvas.width - racketSize.getWidth() - offsetFromEdge,
//         opponent.getLocation().getY(),
//         racketSize.getWidth(),
//         racketSize.getHeight(),
//       );

//       // Draw the score
//       ctx.font = '42px Arial';
//       ctx.textAlign = 'center';

//       const scoreY = 40;

//       ctx.fillText(`1`, canvas.width / 3, scoreY);
//       ctx.fillText(`4`, (2 * canvas.width) / 3, scoreY);

//       // Move the ball
//       ballEntity2.move(ballEntity.getLocation.getX(), ballEntity.getLocation.getY());

//       // Draw the ball
//       ctx.beginPath();
//       ctx.arc(
//         ballEntity.getLocation().getX(),
//         ballEntity.getLocation().getY(),
//         ballSize.getWidth() / 2,
//         0,
//         Math.PI * 2,
//       );
//       ctx.fillStyle = 'white';
//       ctx.fill();

//       // Collision handling
//       if (
//         ballEntity2.checkCollisionWith(area.current, area.current.getOpponent()))
//           ballEntity2.bounceOffRacket(area.current.getOpponent());
//       else if (
//         ballEntity2.checkCollisionWith(area.current, area.current.getPlayer()))
//         ballEntity2.bounceOffRacket(area.current.getPlayer());
//       else if (ballEntity2.isOutOfCanvas(area.current, canvas.width)) {
//         if (ballEntity.getLocation().getX() < 0) {
//           area.current.getOpponent().incrementScore();
//         } else {
//           area.current.getPlayer().incrementScore();
//         }
//         ballEntity2.reset();
//       }

//       requestAnimationFrame(draw);
//     };

//     // Launch the ball randomly in the beginning
//     const ballEntity = area.current.getBall();
//     const player = area.current.getPlayer();
//     if (player) {
//       ballEntity.launchRandom(player);
//     }

//     // Call the drawing function
//     draw();

//     return () => {
//       canvas.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, [socket, racketY]);

//   return (
//     <div>
//       <div className="centered-container">
//         <canvas ref={canvasRef} width={800} height={400} />
//       </div>
//     </div>
//   );
// };

// export default PongGame;
