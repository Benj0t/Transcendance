import React, { useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// import WaitingRoom from './pages/WaitingRoom';
import Chat from './pages/Chat';
import History from './pages/History';
import Game from './pages/Game';
import { read_cookie } from 'sfcookies';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Friends from './pages/Friends';
import NoMatch from './pages/NoMatch';
import AuthCallback from './pages/AuthCallback';
import SettingsPage from './pages/SettingsPage';
import { pongSocket } from './components/pongSocket';
import PongGame from './components/PongGame';

function PublicRoute({ children }: { children: JSX.Element }): JSX.Element {
  const cookie = read_cookie('jwt');
  console.log(cookie);
  if (cookie.length === 0) {
    return <LoginPage />;
  }
  return <Navigate to="/" />;
}

function CallbackRoute({ children }: { children: JSX.Element }): JSX.Element {
  const cookie = read_cookie('jwt');
  console.log(cookie);
  if (cookie.length === 0) {
    return <AuthCallback />;
  }
  return <Navigate to="/login" />;
}

function PrivateRoute({ children }: { children: JSX.Element }): JSX.Element {
  const userIsAuthenticated = read_cookie('jwt');
  // requete backend avec le cookie d'auth -> le backend verifie que le cookie est valide aupres de l'auth42
  if (userIsAuthenticated.length !== 0) return <>{children}</>;
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
  useEffect(() => {
    pongSocket?.on('time_packet', (packetOutTime) => {
      console.log(pongSocket.id);
      pongSocket.emit('keep_alive_packet', packetOutTime);
    });
  }, []);
  return (
    <CssBaseline>
      <div className="App">
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
                  <PongGame />
                </ThemeProvider>
              }
            />
            <Route
              path="/game"
              element={
                <ThemeProvider theme={darkTheme}>
                  <PrivateRoute>
                    <Game />
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
              path="/auth/callback"
              element={
                <ThemeProvider theme={darkTheme}>
                  <CallbackRoute>
                    <AuthCallback />
                  </CallbackRoute>
                </ThemeProvider>
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
      </div>
    </CssBaseline>
  );
};

export default App;
