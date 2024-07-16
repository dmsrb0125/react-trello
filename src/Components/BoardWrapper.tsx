import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import Column from "./Column";
import AddColumnButton from "./AddColumnButton";
import { TaskColumnResponseDto, ITodo } from "../types";
import axiosInstance from "../axiosConfig";
import { useToDoContext } from "../ToDoContext";
import { useAuth } from "../AuthContext";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

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

const TitleInput = styled.input`
  font-size: 36px;
  border: none;
  border-bottom: 2px solid #007bff;
  margin-right: 10px;
`;

const DescriptionInput = styled.input`
  font-size: 20px;
  color: grey;
  border: none;
  border-bottom: 2px solid #007bff;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
`;

const DeleteButton = styled(Button)`
  background-color: #ff4d4d;
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
`;

const Divider = styled.hr`
  width: 100%;
  border: 1px solid #ccc;
  margin: 20px 0;
`;

const Title = styled.h1`
  font-size: 36px;
`;

const Description = styled.h2`
  font-size: 20px;
  color: grey;
`;

const BoardWrapper: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { isAuthenticated } = useAuth();
  const { toDos, setToDos } = useToDoContext();
  const [columns, setColumns] = useState<TaskColumnResponseDto[]>([]);
  const [boardName, setBoardName] = useState<string>("");
  const [boardDescription, setBoardDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    const savedBoardId = localStorage.getItem("currentBoardId");
    const currentBoardId = boardId || savedBoardId;

    if (currentBoardId) {
      localStorage.setItem("currentBoardId", currentBoardId);
    } else {
      setError("Board ID is missing");
      return;
    }

    const fetchBoardData = async () => {
      try {
        const response = await axiosInstance.get(`/boards/${currentBoardId}`);
        const boardData = response.data.data;
        setBoardName(boardData.boardName);
        setBoardDescription(boardData.boardDescription);

        const columnsResponse = await axiosInstance.get(
          `/boards/${currentBoardId}/columns`
        );
        const columnsData: TaskColumnResponseDto[] = columnsResponse.data.data;

        const validColumns = columnsData.filter(
          (column) => column.id !== undefined
        );

        if (validColumns.length !== columnsData.length) {
          throw new Error("Some columns are missing id property");
        }

        setColumns(validColumns);

        const initialToDos: { [key: number]: ITodo[] } = {};
        await Promise.all(
          validColumns.map(async (column) => {
            const cardsResponse = await axiosInstance.get(
              `/columns/${column.id}/cards`
            );
            initialToDos[column.id] = cardsResponse.data.data;
          })
        );
        setToDos(initialToDos);
      } catch (error) {
        console.error("Failed to fetch board data:", error);
        setError("Failed to fetch board data");
      }
    };

    fetchBoardData();
  }, [boardId, setToDos, isAuthenticated]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumnId = parseInt(
      source.droppableId.replace("column-", ""),
      10
    );
    const finishColumnId = parseInt(
      destination.droppableId.replace("column-", ""),
      10
    );

    const startColumnTasks = Array.from(toDos[startColumnId]);
    const [movedTask] = startColumnTasks.splice(source.index, 1);

    if (startColumnId === finishColumnId) {
      startColumnTasks.splice(destination.index, 0, movedTask);
      const newToDos = { ...toDos, [startColumnId]: startColumnTasks };
      setToDos(newToDos);

      try {
        await axiosInstance.put(`/cards/${movedTask.id}/order`, {
          cardOrder: destination.index,
        });
      } catch (error) {
        console.error("Failed to update card order:", error);
      }
    } else {
      const finishColumnTasks = Array.from(toDos[finishColumnId]);
      finishColumnTasks.splice(destination.index, 0, movedTask);
      const newToDos = {
        ...toDos,
        [startColumnId]: startColumnTasks,
        [finishColumnId]: finishColumnTasks,
      };
      setToDos(newToDos);

      try {
        await axiosInstance.put(`/cards/${movedTask.id}/order`, {
          cardOrder: destination.index,
          taskColumn: finishColumnId,
        });
      } catch (error) {
        console.error("Failed to update card order:", error);
      }
    }
  };

  const handleBoardDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this board?"
    );
    if (confirmed && boardId) {
      try {
        await axiosInstance.delete(`/boards/${boardId}`);
        navigate("/");
      } catch (error) {
        console.error("Failed to delete board:", error);
      }
    }
  };

  const handleBoardEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (boardId) {
      try {
        await axiosInstance.put(`/boards/${boardId}`, {
          boardName,
          boardDescription,
        });
        setIsEditing(false);
        window.location.reload();
      } catch (error) {
        console.error("Failed to edit board:", error);
      }
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Header>
          <div>
            {isEditing ? (
              <>
                <TitleInput
                  type="text"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                />
                <DescriptionInput
                  type="text"
                  value={boardDescription}
                  onChange={(e) => setBoardDescription(e.target.value)}
                />
                <Button onClick={handleBoardEdit}>Save</Button>
                <CancelButton onClick={() => setIsEditing(false)}>
                  Cancel
                </CancelButton>
              </>
            ) : (
              <>
                <Title>{boardName}</Title>
                <Description>{boardDescription}</Description>
              </>
            )}
          </div>
          {!isEditing && (
            <div>
              <Button onClick={() => setIsEditing(true)}>Edit Board</Button>
              <DeleteButton onClick={handleBoardDelete}>
                Delete Board
              </DeleteButton>
              <Button onClick={() => navigate("/")}>Main Page</Button>
            </div>
          )}
        </Header>
        <Divider />
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="COLUMN"
        >
          {(provided) => (
            <Columns ref={provided.innerRef} {...provided.droppableProps}>
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
              {provided.placeholder}
            </Columns>
          )}
        </Droppable>
        <AddColumnButton boardId={Number(boardId)} setColumns={setColumns} />
      </Wrapper>
    </DragDropContext>
  );
};

export default BoardWrapper;
