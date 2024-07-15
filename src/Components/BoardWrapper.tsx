import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import axiosInstance from "../axiosConfig";
import { toDoState } from "../atoms";
import Column from "./Column";

// 스타일드 컴포넌트 정의
const BoardDetail = styled.div`
  padding: 20px;
  background-color: #87ceeb; /* Sky blue background */
`;

const BoardTitle = styled.h2`
  font-size: 36px; /* Larger font size */
  text-align: center; /* Center align */
  margin-bottom: 20px;
  color: #333; /* Darker text color */
`;

const BoardDescription = styled.p`
  font-size: 20px; /* Medium font size */
  text-align: center; /* Center align */
  margin-bottom: 30px;
  color: #666; /* Gray text color */
`;

const ColumnContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BoardWrapper: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [board, setBoard] = useState<any>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      console.log(`Fetching board with ID: ${boardId}`);
      try {
        const response = await axiosInstance.get(`/boards/${boardId}`);
        console.log("Board data fetched:", response.data);
        if (response.data && response.data.data) {
          setBoard(response.data.data);
        } else {
          console.error("Unexpected response structure", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch board:", error);
      }
    };

    if (boardId) {
      fetchBoard();
    }
  }, [boardId]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setToDos((prev) => {
      const sourceBoard = [...prev[source.droppableId]];
      const destinationBoard = [...prev[destination.droppableId]];
      const [movedTask] = sourceBoard.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceBoard.splice(destination.index, 0, movedTask);
        return {
          ...prev,
          [source.droppableId]: sourceBoard,
        };
      } else {
        destinationBoard.splice(destination.index, 0, movedTask);
        return {
          ...prev,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      }
    });
  };

  if (!boardId || !board) {
    return <div>Board not found</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <BoardDetail>
        <BoardTitle>{board.boardName}</BoardTitle>
        <BoardDescription>{board.boardDescription}</BoardDescription>
        <ColumnContainer>
          {["To Do", "Doing", "Done"].map((columnId) => (
            <Column
              key={columnId}
              boardId={boardId}
              columnId={columnId}
              toDos={toDos[columnId] || []}
            />
          ))}
        </ColumnContainer>
      </BoardDetail>
    </DragDropContext>
  );
};

export default BoardWrapper;
