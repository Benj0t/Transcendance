import React, { useContext, useEffect, useRef, useState } from 'react';
import './styles/PongGame.css';
import Area from './utils/Area';
// import { PacketInKeepAlive } from './packet/in/PacketInKeepAlive';
import { getPongSocket } from '../components/pongSocket';
import { PacketInDual } from './packet/in/PacketInDual';
import { UserContext } from '../context/userContext';

const PongGame: React.FC = (): any => {
  const pongSocket = getPongSocket();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [racketY, setRacketY] = useState(180);
  const [isChoosingMatchmaking, setIsChoosingMatchmaking] = useState(false);
  const [isChoosingDuel, setIsChoosingDuel] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [opponentId, setOpponentId] = useState(0);
  const [area] = useState<Area | null>(new Area(800, 400, 0, 0));
  const [ballXPCent, setBallX] = useState(0);
  const [ballYPCent, setBallY] = useState(0);
  const [toLeft, setToLeft] = useState(true);
  const [opponentYPCent, setOpponentY] = useState(180);
  // const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(0);
  const [scorePlayer, setScorePlayer] = useState(0);
  const [scoreOpponent, setScoreOpponent] = useState(0);
  const me = useContext(UserContext).user;

  const sendEasyMatchmakingPacket = (): void => {
    pongSocket.emit('dual_packet', new PacketInDual(-2));
    setGameStarted(true);
  };

  const sendNormalMatchmakingPacket = (): void => {
    pongSocket.emit('dual_packet', new PacketInDual(0));
    setGameStarted(true);
  };

  const sendHardMatchmakingPacket = (): void => {
    pongSocket.emit('dual_packet', new PacketInDual(-1));
    setGameStarted(true);
  };

  const sendDualPacket = (opponentId: number): any => {
    pongSocket.emit('dual_packet', new PacketInDual(opponentId));
    setIsChoosingDuel(true);
    setGameStarted(true);
  };

  const sendKeepAlivePacket = (racketY: number): any => {
    me.yPcent = racketY;
    // pongSocket.emit('keep_alive_packet', pongSocket, new PacketInKeepAlive(racketY));
  };

  // const receivePacket = (data: any): void => {
  //   setBallX(data.ballXPCent);
  //   setBallY(data.ballYPCent);
  //   // setToLeft(data.toLeft);
  //   setOpponentY(data.opponentYPCent);
  //   // setPlaying(data.playing);
  //   // setTime(data.time);
  // };

  // const setIdle = (): any => {
  //   setGameWindow(null);
  // };

  // const setPlaying = (): any => {
  // };
  const handleSocketData = (data: any): void => {
    setBallX(data.ballXPCent);
    setBallY(data.ballYPCent);
    setToLeft(data.toLeft);
    setOpponentY(data.opponentYPCent);
    setScorePlayer(data.scorePlayer);
    setScoreOpponent(data.scoreOpponent);
    // setPlaying(data.playing);
    setTime(data.time);
    setStart(data.start);
  };

  const handleEndGame = (): void => {
    setRacketY(180);
    setIsChoosingMatchmaking(false);
    setIsChoosingDuel(false);
    setGameStarted(false);
    setOpponentId(0);
    setBallX(0);
    setBallY(0);
    setToLeft(true);
    setOpponentY(180);
    setTime(0);
    setStart(0);
    setScorePlayer(0);
    setScoreOpponent(0);
  };

  const handlePopstate = (event: any): void => {
    event.preventDefault();
    pongSocket.emit('dual_cancel_packet');
  };

  useEffect(() => {
    pongSocket.on('time_packet', handleSocketData);
    pongSocket.on('end_game_packet', handleEndGame);
    window.addEventListener('popstate', handlePopstate);
    const canvas = canvasRef.current;
    if (canvas == null) return;

    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    if (area == null) return;

    // console.log('Canvas Width:', canvas.width);
    // console.log('Canvas Height:', canvas.height);

    const handleMouseMove = (e: MouseEvent): void => {
      const canvasRect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - canvasRect.top;
      const maxY = canvas.height - area.racketSize().getHeight();
      const newRacketY = Math.min(maxY, Math.max(0, mouseY));

      setRacketY(newRacketY);
      // sendKeepAlivePacket(racketY);
      me.yPcent = racketY;
    };

    const draw = (): void => {
      if (isGameStarted) {
        // pongSocket.on('time_packet', (data: any) => {
        //   receivePacket(data);
        // });
        // if (isChoosingMatchmaking) {
        //   sendMatchmakingPacket();
        // } else if (isChoosingDuel) {
        //   sendDualPacket(opponentId);
        // }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessiner un rectangle noir qui remplit le canvas
        ctx.fillStyle = 'purple';
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

        const racketSize = area.racketSize();
        const ballSize = area.ballSize();

        // Espacement des raquettes par rapport aux bords
        const offsetFromEdge = 10;

        // Dessiner les raquettes et la balle en utilisant les données de Area
        toLeft
          ? ctx.fillRect(
              offsetFromEdge,
              (opponentYPCent * 360) / 100,
              racketSize.getWidth(),
              racketSize.getHeight(),
            )
          : ctx.fillRect(offsetFromEdge, racketY, racketSize.getWidth(), racketSize.getHeight());

        toLeft
          ? ctx.fillRect(
              canvas.width - racketSize.getWidth() - offsetFromEdge,
              racketY,
              racketSize.getWidth(),
              racketSize.getHeight(),
            )
          : ctx.fillRect(
              canvas.width - racketSize.getWidth() - offsetFromEdge,
              (opponentYPCent * 360) / 100,
              racketSize.getWidth(),
              racketSize.getHeight(),
            );

        // Dessiner le score
        ctx.font = '42px Arial';
        ctx.textAlign = 'center';

        const scoreY = 40; // Position verticale commune pour les scores

        toLeft
          ? ctx.fillText(String(scorePlayer), canvas.width / 3, scoreY)
          : ctx.fillText(String(scorePlayer), canvas.width / 3, scoreY);

        toLeft
          ? ctx.fillText(String(scoreOpponent), (2 * canvas.width) / 3, scoreY)
          : ctx.fillText(String(scoreOpponent), (2 * canvas.width) / 3, scoreY);

        ctx.beginPath();
        ctx.arc(
          (ballXPCent * canvas.width) / 100,
          (ballYPCent * canvas.height) / 100,
          ballSize.getWidth() / 2,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = 'white';
        ctx.fill();

        if (canvas != null) sendKeepAlivePacket(racketY);

        // Dessiner le countdown de début de partie

        if ((Date.now() - start) / 1000 < 5) {
          ctx.font = '108px Arial';
          ctx.beginPath();
          ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            54,
            0,
            Math.PI *
              2 *
              (1 - ((start - Date.now()) / 1000 - Math.floor((start - Date.now()) / 1000))),
          );
          ctx.lineWidth = 10;
          ctx.stroke();

          ctx.fillText(
            String(Math.ceil(5 + (start - Date.now()) / 1000)),
            canvas.width / 2,
            canvas.height / 2 + 35,
          );
        }
      }
    };

    requestAnimationFrame(draw);

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
      canvas.removeEventListener('mousemove', handleMouseMove);
      pongSocket.off('time_packet', handleSocketData);
      pongSocket.off('end_game_packet', handleEndGame);
    };
  }, [time]);

  return (
    <div>
      <div className="centered-container">
        {isGameStarted ? (
          start !== null ? (
            <canvas ref={canvasRef} width={800} height={400} />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
              }}
            >
              <center>
                <h3> Waiting for opponent... </h3>
              </center>
            </div>
          )
        ) : (
          <div>
            {isChoosingMatchmaking ? (
              <div>
                <button onClick={sendEasyMatchmakingPacket}>Easy</button>
                <button onClick={sendNormalMatchmakingPacket}>Normal</button>
                <button onClick={sendHardMatchmakingPacket}>Hard</button>
              </div>
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
