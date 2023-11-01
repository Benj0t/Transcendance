import React, { useEffect } from 'react';
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
import { pongSocket } from './components/pongSocket';
import PongGame from './components/PongGame';
import ConfirmTwoFactor from './pages/ConfirmTwoFactor';
import Cookies from 'js-cookie';

function PublicRoute({ children }: { children: JSX.Element }): JSX.Element {
  console.log(Cookies.get('jwt'));
  if (Cookies.get('jwt') === undefined) {
    return <LoginPage />;
  }
  return <Navigate to="/" />;
}

function CallbackRoute({ children }: { children: JSX.Element }): JSX.Element {
  const cookie = Cookies.get('jwt');
  console.log(cookie);
  if (Cookies.get('jwt') === undefined) {
    return <AuthCallback />;
  }
  return <Navigate to="/login" />;
}

function PrivateRoute({ children }: { children: JSX.Element }): JSX.Element {
  const userIsAuthenticated = Cookies.get('jwt');
  // requete backend avec le cookie d'auth -> le backend verifie que le cookie est valide aupres de l'auth42
  if (userIsAuthenticated === undefined) return <>{children}</>;
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

const App: React.FC = () => {
  useEffect(() => {
    pongSocket?.on('time_packet', (packetOutTime) => {
      console.log(pongSocket.id);
      pongSocket.emit('keep_alive_packet', packetOutTime);
    });
  }, []);
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <HomePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              ></Route>
              <Route
                path="/waiting-room"
                element={
                  <PrivateRoute>
                    <PongGame />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Game"
                element={
                  <PrivateRoute>
                    <Game />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
              <Route
                path="/friends"
                element={
                  <PrivateRoute>
                    <Friends />
                  </PrivateRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <PrivateRoute>
                    <History />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
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
              <Route path="*" element={<NoMatch />} />
            </Routes>
          </BrowserRouter>
        </div>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
