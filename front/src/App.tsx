import React from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import WaitingRoom from './pages/WaitingRoom';
import Chat from './pages/Chat';
import Game from './pages/Game';
import Profile from './pages/Profile';
import { read_cookie } from 'sfcookies';

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
    <div>
      Unauthorized content, please login <a href="http://localhost:3000/auth"> HERE</a>
    </div>
  );
}

const App: React.FC = () => {
  return (
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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
