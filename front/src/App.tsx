import React, { useEffect, useState } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import WaitingRoom from './pages/WaitingRoom';
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
import { UserContext } from './context/userContext';
import { PacketInKeepAlive } from './components/packet/in/PacketInKeepAlive';
// import { PacketOutTimeUpdate } from './components/packet/out/PacketOutTimeUpdate';

function PublicRoute({ children }: { children: JSX.Element }): JSX.Element {
  const cookie = read_cookie('userIsAuth');
  console.log(cookie);
  if (cookie !== 'true') {
    return <LoginPage />;
  }
  return <Navigate to="/" />;
}

function PrivateRoute({ children }: { children: JSX.Element }): JSX.Element {
  const userIsAuthenticated = read_cookie('userIsAuth');
  // requete backend avec le cookie d'auth -> le backend verifie que le cookie est valide aupres de l'auth42
  if (userIsAuthenticated === 'true') return <>{children}</>;
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
  const [user, setUser] = useState({
    id: 0,
    timer: 1000,
    timeout: setInterval(() => {
      pongSocket.emit('keep_alive_packet', new PacketInKeepAlive(0));
      console.log(1000);
    }, 1000),
  });

  useEffect(() => {
    pongSocket.on('time_packet', () => {
      console.log(pongSocket.id);
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
                      <WaitingRoom />
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
                  path="/auth/callback"
                  element={
                    // <PublicRoute>
                    <AuthCallback />
                    // </PublicRoute>
                  }
                />
                <Route path="*" element={<NoMatch />} />
              </Routes>
            </BrowserRouter>
          </div>
        </CssBaseline>
      </ThemeProvider>
    </UserContext.Provider>
  );
};
export default App;
