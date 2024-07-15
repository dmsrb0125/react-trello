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
import BoardWrapper from "./Components/BoardWrapper"; // Board 컴포넌트 임포트
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
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Routes>
                      <Route path="/" element={<Main />} />
                      <Route path="/board-create" element={<BoardCreate />} />
                      <Route
                        path="/board/:boardId"
                        element={<BoardWrapper />}
                      />
                    </Routes>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </DragDropContext>
      </ToDoProvider>
    </AuthProvider>
  );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
