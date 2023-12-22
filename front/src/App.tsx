import React, { useState, useContext, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import WaitingRoom from './pages/WaitingRoom';
import Chat from './pages/Chat';
import History from './pages/History';
import Game from './pages/Game';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Friends from './pages/Friends';
import NoMatch from './pages/NoMatch';
import AuthCallback from './pages/AuthCallback';
import SettingsPage from './pages/SettingsPage';
// import { pongSocket } from './components/pongSocket';
import PongGame from './components/PongGame';
import ConfirmTwoFactor from './pages/ConfirmTwoFactor';
import Cookies from 'js-cookie';
import { UserContext } from './context/userContext';
import GetUserMe from './requests/getUserMe';
// import { getPongSocket } from './context/pongSocket';
import { SocketProvider, useWebSocket } from './context/pongSocket';
import ProfilePage from './pages/ProfilePage';
// import { PacketInHandshake } from './components/packet/in/PacketInHandshake';
// import { PacketInKeepAlive } from './components/packet/in/PacketInKeepAlive';

function PublicRoute({ children }: { children: JSX.Element }): JSX.Element {
  if (Cookies.get('jwt') === undefined) {
    return <LoginPage />;
  }
  return <Navigate to="/" />;
}

function CallbackRoute({ children }: { children: JSX.Element }): JSX.Element {
  const cookie = Cookies.get('jwt');
  void cookie;
  if (Cookies.get('jwt') === undefined) {
    return <AuthCallback />;
  }
  return <Navigate to="/login" />;
}

function PrivateRoute({ children }: { children: JSX.Element }): JSX.Element {
  const userIsAuthenticated = Cookies.get('jwt');
  const me = useContext(UserContext).user;
  // const { pongSocket, createSocket } = useWebSocket();

  // useEffect(() => {
  //   if (pongSocket === null) {
  //     createSocket();
  //   }

  //   return () => {
  //     if (pongSocket !== null) {
  //       pongSocket.disconnect();
  //     }
  //   };
  // }, []);
  // ??
  // const sockContext = React.useContext(SocketContext);
  // const pongSocket = sockContext.pongSocket;
  // const pongSocket = getPongSocket();
  if (userIsAuthenticated !== undefined) {
    GetUserMe()
      .then((reqdata) => {
        me.id = reqdata.id;
        // if (pongSocket !== null) pongSocket.emit('handshake_packet', new PacketInHandshake(me.id));
      })
      .catch((error) => {
        console.log(error);
        // return error page
      });
    return <>{children}</>;
  }
  return (
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
        <h3>
          L accès à ce contenu vous est interdit, veuillez vous identifier
          <br />
          <a href="http://localhost:3000/login">HERE</a>
        </h3>
      </center>
    </div>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const App: React.FC = () => {
  const [userMe, setUserMe] = useState({
    id: 0,
    nickname: '',
    yPcent: 0,
    opponent: 0,
    tmpscore: 0,
  });
  const { pongSocket, createSocket } = useWebSocket();

  useEffect(() => {
    if (pongSocket === null) {
      createSocket();
    }

    return () => {
      if (pongSocket !== null) {
        pongSocket.disconnect();
      }
    };
  }, [pongSocket, createSocket]);
  return (
    <CssBaseline>
      <div className="App">
        <ToastContainer />
        <UserContext.Provider value={{ user: userMe, setUser: setUserMe }}>
          <SocketProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ThemeProvider theme={darkTheme}>
                      <PrivateRoute>
                        <HomePage />
                      </PrivateRoute>
                    </ThemeProvider>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <ThemeProvider theme={darkTheme}>
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    </ThemeProvider>
                  }
                />
                <Route
                  path="/waiting-room"
                  element={
                    <ThemeProvider theme={lightTheme}>
                      <Game />
                    </ThemeProvider>
                  }
                />
                <Route
                  path="/game"
                  element={
                    <ThemeProvider theme={darkTheme}>
                      <PrivateRoute>
                        <PongGame />
                      </PrivateRoute>
                    </ThemeProvider>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ThemeProvider theme={darkTheme}>
                      <PrivateRoute>
                        <Chat />
                      </PrivateRoute>
                    </ThemeProvider>
                  }
                />
                <Route
                  path="/profile/:userID"
                  element={
                    <ThemeProvider theme={darkTheme}>
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    </ThemeProvider>
                  }
                />
                <Route
                  path="/friends"
                  element={
                    <ThemeProvider theme={darkTheme}>
                      <PrivateRoute>
                        <Friends />
                      </PrivateRoute>
                    </ThemeProvider>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ThemeProvider theme={darkTheme}>
                      <PrivateRoute>
                        <History />
                      </PrivateRoute>
                    </ThemeProvider>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ThemeProvider theme={darkTheme}>
                      <PrivateRoute>
                        <SettingsPage />
                      </PrivateRoute>
                    </ThemeProvider>
                  }
                />
                <Route
                  path="/confirmTwoFactor"
                  element={
                    <PrivateRoute>
                      <ConfirmTwoFactor />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/auth/callback"
                  element={
                    <CallbackRoute>
                      <AuthCallback />
                    </CallbackRoute>
                  }
                />
                <Route
                  path="*"
                  element={
                    <ThemeProvider theme={darkTheme}>
                      <NoMatch />
                    </ThemeProvider>
                  }
                />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </UserContext.Provider>
      </div>
    </CssBaseline>
  );
};

export default App;
