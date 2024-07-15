import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  useParams,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Column from "./Column";
import AddColumnButton from "./AddColumnButton";
import { TaskColumnResponseDto, IToDoState } from "../types";
import axiosInstance from "../axiosConfig";
import { ToDoContext } from "./ToDoContext";
import { useAuth } from "../AuthContext";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Columns = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 10px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 36px;
`;

const Description = styled.h2`
  font-size: 20px;
  color: grey;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
`;

const Divider = styled.hr`
  width: 100%;
  border: 1px solid #ccc;
  margin: 20px 0;
`;

const BoardWrapper: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { isAuthenticated } = useAuth();
  const { toDos, setToDos } = useContext(ToDoContext)!;
  const [columns, setColumns] = useState<TaskColumnResponseDto[]>([]);
  const [boardName, setBoardName] = useState<string>("");
  const [boardDescription, setBoardDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    const savedState = location.state as { inputValue: string };
    if (savedState && savedState.inputValue) {
      localStorage.setItem("inputValue", savedState.inputValue);
    } else {
      const storedValue = localStorage.getItem("inputValue");
      if (storedValue) {
        console.log(storedValue);
      }
    }

    if (!boardId) {
      setError("Board ID is missing");
      return;
    }

    const fetchBoardData = async () => {
      try {
        const response = await axiosInstance.get(`/boards/${boardId}`);
        const boardData = response.data.data;
        setBoardName(boardData.boardName);
        setBoardDescription(boardData.boardDescription);

        const columnsResponse = await axiosInstance.get(
          `/boards/${boardId}/columns`
        );
        const columnsData: TaskColumnResponseDto[] = columnsResponse.data.data;

        const validColumns = columnsData.filter(
          (column) => column.id !== undefined
        );

        if (validColumns.length !== columnsData.length) {
          throw new Error("Some columns are missing id property");
        }

        setColumns(validColumns);

        const initialToDos: IToDoState = {};
        validColumns.forEach((column) => {
          initialToDos[column.id] = [];
        });
        setToDos(initialToDos);
      } catch (error) {
        console.error("Failed to fetch board data:", error);
        setError("Failed to fetch board data");
      }
    };

    fetchBoardData();
  }, [boardId, setToDos, isAuthenticated, location.state]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (type === "COLUMN") {
      const newColumns = Array.from(columns);
      const [removed] = newColumns.splice(source.index, 1);
      newColumns.splice(destination.index, 0, removed);
      setColumns(newColumns);
    } else {
      setToDos((allBoards: any) => {
        const sourceBoard = [
          ...allBoards[source.droppableId as unknown as number],
        ];
        const destinationBoard = [
          ...allBoards[destination.droppableId as unknown as number],
        ];
        const [movedTask] = sourceBoard.splice(source.index, 1);

        if (destination.droppableId === source.droppableId) {
          sourceBoard.splice(destination.index, 0, movedTask);
          return {
            ...allBoards,
            [source.droppableId as unknown as number]: sourceBoard,
          };
        } else {
          destinationBoard.splice(destination.index, 0, movedTask);
          return {
            ...allBoards,
            [source.droppableId as unknown as number]: sourceBoard,
            [destination.droppableId as unknown as number]: destinationBoard,
          };
        }
      });
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Wrapper>
        <Header>
          <div>
            <Title>{boardName}</Title>
            <Description>{boardDescription}</Description>
          </div>
          <Button onClick={() => navigate("/")}>Main Page</Button>
        </Header>
        <Divider />
        <Columns>
          {columns.map((column, index) => (
            <Column
              key={column.id}
              boardId={Number(boardId)}
              columnId={column.id}
              columnName={column.columnName}
              toDos={toDos[column.id] || []}
              index={index}
            />
          ))}
        </Columns>
        <AddColumnButton boardId={Number(boardId)} setColumns={setColumns} />
      </Wrapper>
    </DndProvider>
  );
};

export default BoardWrapper;
