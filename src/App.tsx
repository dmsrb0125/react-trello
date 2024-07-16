import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Main from "./Components/Main";
import BoardCreate from "./Components/BoardCreate";
import Login from "./Components/Login";
import BoardWrapper from "./Components/BoardWrapper";
import { AuthProvider, useAuth } from "./AuthContext";
import { ToDoProvider } from "./ToDoContext";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

const App: React.FC = () => {
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    // 드래그 앤 드롭 후의 로직 구현
  };

  return (
    <AuthProvider>
      <ToDoProvider>
        <DragDropContext onDragEnd={onDragEnd}>
          <Router>
            <AppRoutes />
          </Router>
        </DragDropContext>
      </ToDoProvider>
    </AuthProvider>
  );
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const lastVisitedPath = localStorage.getItem("lastVisitedPath");
      if (lastVisitedPath && location.pathname === "/") {
        navigate(lastVisitedPath);
      }
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
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
  );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    localStorage.setItem("lastVisitedPath", location.pathname);
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;
