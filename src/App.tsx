import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Main from "./Components/Main";
import BoardCreate from "./Components/BoardCreate";
import Login from "./Components/Login";
import BoardWrapper from "./Components/BoardWrapper";
import { AuthProvider, useAuth } from "./AuthContext";
import { ToDoProvider } from "./Components/ToDoContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToDoProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/board-create" element={<BoardCreate />} />
                    <Route path="/board/:boardId" element={<BoardWrapper />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </ToDoProvider>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const { pathname } = window.location;

  if (!isAuthenticated) {
    localStorage.setItem("redirectPath", pathname);
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;
