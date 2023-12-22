import React, { useContext, useEffect, useRef, useState } from 'react';
import './styles/PongGame.css';
import Area from './utils/Area';
import { PacketInDual } from './packet/in/PacketInDual';
import { UserContext } from '../context/userContext';
import postAddMatch from '../requests/postAddMatch';
import { useWebSocket } from '../context/pongSocket';
import { notifyToasterSuccess } from './utils/toaster';
import { useNavigate } from 'react-router';
import { CircularProgress } from '@mui/material';

const PongGame: React.FC = (): any => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [racketY, setRacketY] = useState(180);
  const [isChoosingMatchmaking, setIsChoosingMatchmaking] = useState(false);
  const [isChoosingDuel, setIsChoosingDuel] = useState(false);
  const [isGameStarted, setGameStarted] = useState(false);
  const [opponentId, setOpponentId] = useState<number | null>(0);
  const [area] = useState<Area | null>(new Area(800, 400, 0, 0));
  const [ballXPCent, setBallX] = useState(0);
  const [ballYPCent, setBallY] = useState(0);
  const [toLeft, setToLeft] = useState(true);
  const [opponentYPCent, setOpponentY] = useState(180);
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(0);
  const [scorePlayer, setScorePlayer] = useState(0);
  const [scoreOpponent, setScoreOpponent] = useState(0);
  const me = useContext(UserContext).user;
  const { pongSocket, createSocket } = useWebSocket();
  const navigate = useNavigate();
  const test = Date.now();
  const [savedTimer, setSavedTimer] = useState(test);
  const params = new URLSearchParams(location.search);
  const param1 = params.get('param');
  const tmp = typeof param1 === 'string' ? param1 : '';
  const invited = tmp;

  useEffect(() => {
    if (invited !== null && tmp !== '' && tmp !== undefined) {
      sendDualPacket(parseInt(invited));
    }
    if (pongSocket === null) {
      createSocket();
    }

    if (pongSocket !== null) {
      pongSocket.on('history', handleHistory);
      pongSocket.on('end_game_packet', handleEndGame);
      pongSocket.on('time_packet', handleSocketData);
      window.addEventListener('popstate', handlePopstate);
    }

    return () => {
      if (pongSocket !== null) {
        pongSocket.off('history', handleHistory);
        pongSocket.off('end_game_packet', handleEndGame);
        pongSocket.off('time_packet', handleSocketData);
      }
    };
  }, [createSocket]);

  const sendEasyMatchmakingPacket = (): void => {
    if (pongSocket !== null) pongSocket.emit('dual_packet', new PacketInDual(-2));
    setGameStarted(true);
  };

  const sendNormalMatchmakingPacket = (): void => {
    if (pongSocket !== null) pongSocket.emit('dual_packet', new PacketInDual(0));
    setGameStarted(true);
  };

  const sendHardMatchmakingPacket = (): void => {
    if (pongSocket !== null) pongSocket.emit('dual_packet', new PacketInDual(-1));
    setGameStarted(true);
  };

  const sendDualPacket = (opponentId: number): any => {
    if (me.id !== opponentId) {
      if (pongSocket !== null) pongSocket.emit('dual_packet', new PacketInDual(opponentId));
      setIsChoosingDuel(true);
      setGameStarted(true);
    } else alert("You can't duel yourself");
  };

  const sendKeepAlivePacket = (racketY: number): any => {
    me.yPcent = racketY;
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
    navigate('/');
  };

  const handleSocketData = (data: any): void => {
    setBallX(data.ballXPCent);
    setBallY(data.ballYPCent);
    setToLeft(data.toLeft);
    setOpponentY(data.opponentYPCent);
    setScorePlayer(data.scorePlayer);
    setScoreOpponent(data.scoreOpponent);
    setTime(data.time);
    setStart(data.start);
    me.opponent = data.theopponent;
    me.tmpscore = data.scoreOpponent;
  };

  const handleHistory = (): void => {
    postAddMatch(me.id, me.opponent, 5, me.tmpscore, Math.floor((Date.now() - savedTimer) / 1000))
      .then((req) => {
        console.log(req);
        if (req.message === 'ok') notifyToasterSuccess('You won !');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePopstate = (event: any): void => {
    event.preventDefault();
    if (pongSocket !== null) pongSocket.emit('dual_cancel_packet');
  };

  useEffect(() => {
    if (pongSocket !== null) window.addEventListener('popstate', handlePopstate);
    const canvas = canvasRef.current;
    if (canvas == null) return;

    const ctx = canvas.getContext('2d');
    if (ctx == null) return;

    if (area == null) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const canvasRect = canvas.getBoundingClientRect();
      const mouseY = e.clientY - canvasRect.top;
      const maxY = canvas.height - area.racketSize().getHeight();
      const newRacketY = Math.min(maxY, Math.max(0, mouseY));

      setRacketY(newRacketY);
      me.yPcent = racketY;
    };

    const draw = (): void => {
      if (isGameStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'purple';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();

        const racketSize = area.racketSize();
        const ballSize = area.ballSize();

        const offsetFromEdge = 10;

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

        ctx.font = '42px Arial';
        ctx.textAlign = 'center';

        const scoreY = 40;

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

        if ((Date.now() - start) / 1000 < 5) {
          setSavedTimer(Date.now());
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
                <CircularProgress />
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
                    const value = e.target.value.trim();
                    setOpponentId(value !== '' ? parseInt(value, 10) : null);
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
