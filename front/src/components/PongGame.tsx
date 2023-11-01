import React, { useEffect, useRef, useState } from 'react';
import './styles/PongGame.css';
import type Area from '../../../backend/src/utils/Area';
import io from 'socket.io-client';
import { PacketInKeepAlive } from './packet/in/PacketInKeepAlive';

const PongGame: React.FC = (): any => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socket = io('http://localhost:8001');
  const [racketY, setRacketY] = useState(0);
  const [isChoosingMatchmaking, setIsChoosingMatchmaking] = useState(false);
  const [isChoosingDuel, setIsChoosingDuel] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [opponentId, setOpponentId] = useState<number | null>(null);
  const [area, setArea] = useState<Area | null>(null);

  const sendMatchmakingPacket = (): any => {
    socket.emit('DualPacket', 0);
    setGameStarted(true);
  };

  const sendDualPacket = (opponentId: number): any => {
    socket.emit('DualPacket', opponentId);
    setIsChoosingDuel(true);
    setGameStarted(true);
  };

  const sendKeepAlivePacket = (racketY: number): any => {
    socket.emit('keep_alive_packet', socket, new PacketInKeepAlive(racketY));
  };

  const receivePacket = (data: any): void => {
    setArea(data.area);
  };

  // const setIdle = (): any => {
  //   setGameWindow(null);
  // };

  // const setPlaying = (): any => {
  // };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;

    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    if (area == null) return;

    const handleSocketData = (data: any): void => {
      setArea(data);
    };

    socket.on('AreaPacket', handleSocketData);

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
      if (isGameStarted) {
        socket.on('AreaPacket', (data) => {
          receivePacket(data);
        });
        if (isChoosingMatchmaking) {
          sendMatchmakingPacket();
        } else if (isChoosingDuel) {
          const opponentId = 123;
          sendDualPacket(opponentId);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner un rectangle noir qui remplit le canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';

        // Dessiner une ligne blanche autour du canvas pour la bordure
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

        ctx.fillText(`1`, canvas.width / 3, scoreY);
        ctx.fillText(`4`, (2 * canvas.width) / 3, scoreY);

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

        if (canvas != null) sendKeepAlivePacket(racketY);
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
                  onChange={(e): any => {
                    setOpponentId(parseInt(e.target.value));
                  }}
                />
                <button
                  onClick={(): void => {
                    if (opponentId !== null) {
                      sendDualPacket(opponentId);
                    } else {
                      console.log("Entrez d'abord l'ID de l'opposant.");
                    }
                  }}
                >
                  Start Duel
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={(): void => {
                    setIsChoosingMatchmaking(true);
                  }}
                >
                  Matchmaking
                </button>
                <button
                  onClick={(): void => {
                    setIsChoosingDuel(true);
                  }}
                >
                  Duel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PongGame;
