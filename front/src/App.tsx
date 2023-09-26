import React from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import WaitingRoom from './pages/WaitingRoom';
import Chat from './pages/Chat';
import Game from './pages/Game';
import Profile from './pages/Profile';
import { read_cookie } from 'sfcookies';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Friends from './pages/Friends';

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
          Unauthorized content, please login
          <br />
          <a href="http://localhost:3000/auth">HERE</a>
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
                path="/auth"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              ></Route>
              <Route path="/waiting-room" element={<WaitingRoom />} />
              <Route path="/Game" element={<Game />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/friends" element={<Friends />} />
            </Routes>
          </BrowserRouter>
        </div>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default App;
