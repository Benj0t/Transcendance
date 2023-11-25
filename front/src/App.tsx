import React, { useState } from 'react';
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
// import { PacketInKeepAlive } from './components/packet/in/PacketInKeepAlive';

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
  if (userIsAuthenticated !== undefined) return <>{children}</>;
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
  const [userMe, setUserMe] = useState({ id: '0', nickname: '', yPcent: 0 });
  return (
    <CssBaseline>
      <div className="App">
        <ToastContainer />
        <UserContext.Provider value={{ user: userMe, setUser: setUserMe }}>
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
        </UserContext.Provider>
      </div>
    </CssBaseline>
  );
};

export default App;
